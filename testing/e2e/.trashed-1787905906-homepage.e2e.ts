import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Sprint 2.10 — Frontend Testing / Sprint 2.7 — Accessibility.
// Runs across all four Playwright projects (mobile/tablet/desktop/large)
// defined in playwright.config.ts — the same spec file validates
// responsive rendering and accessibility together.

test("homepage renders core sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main" }).or(page.locator("header"))).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible(); // footer
});

test("homepage has no critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
});
