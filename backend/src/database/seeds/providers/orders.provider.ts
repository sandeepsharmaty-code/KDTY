import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";
import type { SeedProvider, SeedProviderResult, SeedEntityOutcome } from "../engine/seed-provider.interface";
import { CustomersService } from "@/modules/customers/customers.service";
import { CartService } from "@/modules/cart/cart.service";
import { OrdersService } from "@/modules/orders/orders.service";
import { ProductsService } from "@/modules/products/products.service";
import { CUSTOMER_SEEDS } from "../data/customers";
import { PRODUCT_SEEDS } from "../data/products";
import type { OrderStatus } from "@/modules/orders/entities/order.entity";

const STATUS_PLAN: OrderStatus[] = ["pending_payment", "processing", "shipped", "delivered", "delivered", "cancelled", "returned", "delivered"];

@Injectable()
export class OrdersSeedProvider implements SeedProvider {
  readonly name = "orders";
  readonly dependsOn: string[] = ["customers"];

  constructor(
    private readonly customers: CustomersService,
    private readonly cart: CartService,
    private readonly orders: OrdersService,
    private readonly products: ProductsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async run(dryRun: boolean): Promise<SeedProviderResult> {
    const start = Date.now();
    const outcomes: SeedEntityOutcome[] = [];

    if (dryRun) {
      for (let i = 0; i < CUSTOMER_SEEDS.length; i++) {
        outcomes.push({ naturalKey: `${CUSTOMER_SEEDS[i].email}#order${i}`, action: "created" });
      }
      return { providerName: this.name, outcomes, durationMs: Date.now() - start };
    }

    for (let i = 0; i < CUSTOMER_SEEDS.length; i++) {
      const customerSeed = CUSTOMER_SEEDS[i];
      const naturalKey = `${customerSeed.email}#order${i}`;
      const customer = await this.customers.findByEmail(customerSeed.email);
      if (!customer) {
        outcomes.push({ naturalKey, action: "rejected-invalid" });
        continue;
      }

      const alreadyHasOrder = (await this.orders.listOrderHistory(customer.id)).length > 0;
      if (alreadyHasOrder) {
        outcomes.push({ naturalKey, action: "skipped-unchanged" });
        continue;
      }

      const product = PRODUCT_SEEDS[i % PRODUCT_SEEDS.length];
      const variant = await this.products.getProduct(product.slug).then((p) => p.variants[0]).catch(() => null);
      if (!variant) {
        outcomes.push({ naturalKey, action: "rejected-invalid" });
        continue;
      }

      const newCart = await this.cart.createCart({ customerId: customer.id });
      await this.cart.addItem(newCart.id, variant.id, 1);
      const order = await this.orders.createOrder(customer.id, newCart.id, {
        line1: customerSeed.address.line1,
        city: customerSeed.address.city,
        region: customerSeed.address.region,
        postalCode: customerSeed.address.postalCode,
        country: customerSeed.address.country,
      });

      const targetStatus = STATUS_PLAN[i % STATUS_PLAN.length];
      console.error(`[orders-seed] customer=${customerSeed.email} orderId=${order.id} status=${order.status} targetStatus=${targetStatus} — about to progress`);
      await this.progressOrderTo(order.id, targetStatus);

      const daysAgo = (i * 7) % 45;
      await this.dataSource.query(
        `UPDATE orders SET "createdAt" = NOW() - make_interval(days => $1) WHERE id = $2`,
        [daysAgo, order.id],
      );

      outcomes.push({ naturalKey, action: "created", entityId: order.id });
    }

    return { providerName: this.name, outcomes, durationMs: Date.now() - start };
  }

  private async progressOrderTo(orderId: string, target: OrderStatus): Promise<void> {
    if (target === "pending_payment") return;

    console.error(`[orders-seed] step=confirm orderId=${orderId}`);
    await this.orders.confirmOrder(orderId, `seed-payment-ref-${orderId.slice(0, 8)}`);
    if (target === "confirmed") return;

    if (target === "cancelled") {
      console.error(`[orders-seed] step=cancel orderId=${orderId}`);
      await this.orders.requestCancellation(orderId, "Seed demo data — customer changed their mind.");
      return;
    }

    console.error(`[orders-seed] step=processing orderId=${orderId}`);
    await this.orders.updateStatus(orderId, "processing");
    if (target === "processing") return;

    console.error(`[orders-seed] step=shipped orderId=${orderId}`);
    await this.orders.updateStatus(orderId, "shipped");
    if (target === "shipped") return;

    console.error(`[orders-seed] step=delivered orderId=${orderId}`);
    await this.orders.updateStatus(orderId, "delivered");
    if (target === "returned") {
      console.error(`[orders-seed] step=return-request orderId=${orderId}`);
      await this.orders.requestReturn(orderId, [], "Seed demo data — shade didn't match expectations.");
      console.error(`[orders-seed] step=return-status orderId=${orderId}`);
      await this.orders.updateStatus(orderId, "returned");
    }
  }

  async rollback(outcomes: SeedEntityOutcome[]): Promise<void> {
    for (const outcome of outcomes) {
      if (outcome.entityId) {
        await this.orders.requestCancellation(outcome.entityId, "Seed rollback.").catch(() => undefined);
      }
    }
  }
}
