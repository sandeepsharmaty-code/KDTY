import { test, expect } from "@playwright/test";

test("header search navigates to search results", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search products" }).or(page.locator("#site-search"));
  await search.fill("Muse Rose");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=Muse/);
});

test("footer exposes all five link columns", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const heading of ["Shop", "Discover", "Account", "Company", "Support"]) {
    await expect(footer.getByRole("navigation", { name: heading })).toBeVisible();
  }
});
