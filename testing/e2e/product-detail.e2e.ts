import { test, expect } from "@playwright/test";

test("product detail page shows shade selector and add-to-cart", async ({ page }) => {
  await page.goto("/products/muse-rose-nail-lacquer");
  await expect(page.getByRole("heading", { name: "Muse Rose Nail Lacquer" })).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "Select a shade" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeEnabled();
});

test("out-of-stock product disables Add to Cart", async ({ page }) => {
  await page.goto("/products/gold-shimmer-topcoat");
  await expect(page.getByRole("button", { name: "Out of Stock" })).toBeDisabled();
});
