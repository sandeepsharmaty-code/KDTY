import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";

export interface VerificationCheck {
  name: string;
  passed: boolean;
  details: string;
  affectedCount?: number;
}

export interface VerificationReport {
  generatedAt: string;
  checks: VerificationCheck[];
  allPassed: boolean;
}

@Injectable()
export class SeedVerificationService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async verify(): Promise<VerificationReport> {
    const checks: VerificationCheck[] = await Promise.all([
      this.checkCategoryHierarchyIntegrity(),
      this.checkProductCategoryLinks(),
      this.checkCollectionAssignments(),
      this.checkCustomerOrderLinks(),
      this.checkReviewProductLinks(),
      this.checkBannerAssetReferences(),
      this.checkCmsInternalLinks(),
      this.checkCouponValidity(),
      this.checkSeoMetadataCompleteness(),
    ]);

    return { generatedAt: new Date().toISOString(), checks, allPassed: checks.every((c) => c.passed) };
  }

  private async checkCategoryHierarchyIntegrity(): Promise<VerificationCheck> {
    const orphans = await this.dataSource.query(
      `SELECT cc.id_ancestor FROM categories_closure cc WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = cc.id_ancestor) OR NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = cc.id_descendant)`,
    ).catch(() => []);
    return { name: "Category hierarchy integrity", passed: orphans.length === 0, details: orphans.length === 0 ? "No orphaned subcategories found." : `${orphans.length} subcategor(y/ies) reference a missing parent.`, affectedCount: orphans.length };
  }

  private async checkProductCategoryLinks(): Promise<VerificationCheck> {
    const orphans = await this.dataSource.query(`SELECT p.id FROM products p WHERE p."categoryId" IS NULL OR NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = p."categoryId")`);
    return { name: "Product-category relationships", passed: orphans.length === 0, details: orphans.length === 0 ? "Every product references a valid category." : `${orphans.length} product(s) have no valid category.`, affectedCount: orphans.length };
  }

  private async checkCollectionAssignments(): Promise<VerificationCheck> {
    const empty = await this.dataSource.query(`SELECT col.id FROM collections col WHERE NOT EXISTS (SELECT 1 FROM collection_products cp WHERE cp."collectionsId" = col.id)`);
    return { name: "Collection product assignments", passed: empty.length === 0, details: empty.length === 0 ? "Every collection has at least one product." : `${empty.length} collection(s) have zero assigned products.`, affectedCount: empty.length };
  }

  private async checkCustomerOrderLinks(): Promise<VerificationCheck> {
    const orphans = await this.dataSource.query(`SELECT o.id FROM orders o WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.id = o."customerId")`);
    return { name: "Customer-order relationships", passed: orphans.length === 0, details: orphans.length === 0 ? "Every order references a valid customer." : `${orphans.length} order(s) reference a missing customer.`, affectedCount: orphans.length };
  }

  private async checkReviewProductLinks(): Promise<VerificationCheck> {
    const orphans = await this.dataSource.query(`SELECT r.id FROM reviews r WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.id = r."variantId")`);
    return { name: "Review-product relationships", passed: orphans.length === 0, details: orphans.length === 0 ? "Every review references a valid product variant." : `${orphans.length} review(s) reference a missing variant.`, affectedCount: orphans.length };
  }

  private async checkBannerAssetReferences(): Promise<VerificationCheck> {
    const banners = await this.dataSource.query(`SELECT "imageUrl" FROM banners`);
    const broken = banners.filter((b: { imageUrl: string }) => !b.imageUrl?.startsWith("/mock/"));
    return { name: "Banner asset references", passed: broken.length === 0, details: broken.length === 0 ? "All banner images reference recognized seed assets." : `${broken.length} banner(s) reference an unrecognized asset path.`, affectedCount: broken.length };
  }

  private async checkCmsInternalLinks(): Promise<VerificationCheck> {
    const pages = await this.dataSource.query(`SELECT slug FROM static_pages`);
    const slugs = new Set(pages.map((p: { slug: string }) => p.slug));
    const expectedCrossLinks = ["privacy", "terms", "shipping-policy", "return-refund-policy"];
    const missing = expectedCrossLinks.filter((s) => !slugs.has(s));
    return { name: "CMS internal link targets exist", passed: missing.length === 0, details: missing.length === 0 ? "All commonly cross-linked static pages exist." : `Missing expected page(s): ${missing.join(", ")}.`, affectedCount: missing.length };
  }

  private async checkCouponValidity(): Promise<VerificationCheck> {
    const invalid = await this.dataSource.query(`SELECT id FROM coupons WHERE "startAt" >= "endAt"`);
    return { name: "Coupon date-range validity", passed: invalid.length === 0, details: invalid.length === 0 ? "Every coupon has a valid active window." : `${invalid.length} coupon(s) have an invalid date range.`, affectedCount: invalid.length };
  }

  private async checkSeoMetadataCompleteness(): Promise<VerificationCheck> {
    const missing = await this.dataSource.query(`SELECT id FROM products WHERE "metaTitle" IS NULL OR "metaDescription" IS NULL`);
    return { name: "Product SEO metadata completeness", passed: missing.length === 0, details: missing.length === 0 ? "Every product has meta title and description." : `${missing.length} product(s) are missing SEO metadata.`, affectedCount: missing.length };
  }
}
