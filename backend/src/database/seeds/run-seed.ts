import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";
import { SeedRootModule } from "./seed-root.module";
import { SeedProvidersModule } from "./providers/seed-providers.module";
import { SeedEngineService } from "./engine/seed-engine.service";
import { SeedVerificationService } from "./engine/seed-verification.service";
import { SettingsSeedProvider } from "./providers/settings.provider";
import { CategoriesSeedProvider } from "./providers/categories.provider";
import { CollectionsSeedProvider } from "./providers/collections.provider";
import { ProductsSeedProvider } from "./providers/products.provider";
import { CmsPagesSeedProvider } from "./providers/cms-pages.provider";
import { FaqsSeedProvider } from "./providers/faqs.provider";
import { BannersSeedProvider } from "./providers/banners.provider";
import { CouponsSeedProvider } from "./providers/coupons.provider";
import { CustomersSeedProvider } from "./providers/customers.provider";
import { OrdersSeedProvider } from "./providers/orders.provider";
import { ReviewsSeedProvider } from "./providers/reviews.provider";
import { AdminUserEntity } from "@/admin/auth/entities/admin-user.entity";
import { AdminRole } from "@/admin/common/admin-role";
import { hashPassword } from "@/modules/auth/password.util";
import { CategoriesService } from "@/modules/categories/categories.service";
import { CATEGORY_TREE } from "./data/categories";

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Bootstrapping application context (dry-run: ${dryRun})...`);

  const app = await NestFactory.createApplicationContext(SeedRootModule, { logger: ["error", "warn"] });
  const dataSource = app.get<DataSource>(getDataSourceToken());

  const adminRepo = dataSource.getRepository(AdminUserEntity);
  const existingAdmin = await adminRepo.findOne({ where: { email: "admin@huemusebeauty.local" } });
  const ADMIN_PHONE_PLACEHOLDER = "+919999999999";
  if (!dryRun) {
    if (!existingAdmin) {
      await adminRepo.save(
        adminRepo.create({
          email: "admin@huemusebeauty.local",
          phoneNumber: ADMIN_PHONE_PLACEHOLDER,
          passwordHash: await hashPassword("ChangeMe123!"),
          firstName: "Super",
          lastName: "Admin",
          role: AdminRole.SUPER_ADMIN,
          active: true,
        }),
      );
      console.log("Seeded 1 Super Admin account (admin@huemusebeauty.local / ChangeMe123! -- change immediately in any non-local environment).");
    } else if (!existingAdmin.phoneNumber) {
      existingAdmin.phoneNumber = ADMIN_PHONE_PLACEHOLDER;
      await adminRepo.save(existingAdmin);
      console.log(`Set placeholder phone number ${ADMIN_PHONE_PLACEHOLDER} on existing Super Admin account -- update to the real number before relying on OTP login.`);
    }
  }

  const providersModuleRef = app.select(SeedProvidersModule);
  const engine = providersModuleRef.get(SeedEngineService, { strict: false });

  for (const ProviderClass of [
    SettingsSeedProvider,
    CategoriesSeedProvider,
    CollectionsSeedProvider,
    ProductsSeedProvider,
    CmsPagesSeedProvider,
    FaqsSeedProvider,
    BannersSeedProvider,
    CouponsSeedProvider,
    CustomersSeedProvider,
    OrdersSeedProvider,
    ReviewsSeedProvider,
  ]) {
    engine.register(providersModuleRef.get(ProviderClass, { strict: false }));
  }

  const summary = await engine.execute(dryRun);

  if (summary.fatalError) {
    console.error(`Seed run failed: ${summary.fatalError}`);
    if (summary.rolledBack) console.error("All completed providers were rolled back.");
    await app.close();
    process.exit(1);
  }

  console.log(
    `Seed complete -- created: ${summary.totals.created}, updated: ${summary.totals.updated}, ` +
      `skipped (unchanged): ${summary.totals.skippedUnchanged}, rejected (invalid): ${summary.totals.rejectedInvalid}.`,
  );

  if (!dryRun && summary.totals.rejectedInvalid > 0) {
    console.warn(`${summary.totals.rejectedInvalid} entities were rejected by the Content Validation Engine -- see report above for details.`);
  }

  if (!dryRun) {
    const categoriesService = providersModuleRef.get(CategoriesService, { strict: false });
    const currentSlugs = new Set<string>();
    for (const node of CATEGORY_TREE) {
      currentSlugs.add(node.slug);
      for (const child of node.children ?? []) currentSlugs.add(child.slug);
    }
    const roots = await categoriesService.listCategories();
    const staleChildren: { id: string; slug: string }[] = [];
    const staleParents: { id: string; slug: string }[] = [];
    for (const root of roots) {
      for (const child of root.children ?? []) {
        if (!currentSlugs.has(child.slug)) staleChildren.push({ id: child.id, slug: child.slug });
      }
      if (!currentSlugs.has(root.slug)) staleParents.push({ id: root.id, slug: root.slug });
    }
    for (const c of staleChildren) await categoriesService.deleteById(c.id).catch(() => undefined);
    for (const c of staleParents) await categoriesService.deleteById(c.id).catch(() => undefined);
    const staleCount = staleChildren.length + staleParents.length;
    if (staleCount > 0) {
      console.log(`Pruned ${staleCount} categories no longer in the current hierarchy.`);
    }
  }

  if (!dryRun) {
    const verification = providersModuleRef.get(SeedVerificationService, { strict: false });
    const verificationReport = await verification.verify();
    console.log(`Verification: ${verificationReport.allPassed ? "all checks passed" : "one or more checks FAILED"} (${verificationReport.checks.length} checks run).`);
    if (!verificationReport.allPassed) {
      console.warn("One or more verification checks failed -- review the report above.");
    }
  }

  await app.close();
}

run().catch((error) => {
  console.error("Seed script crashed:", error);
  process.exit(1);
});
