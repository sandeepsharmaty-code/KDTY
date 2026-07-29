import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Sprint 6B — End-to-End Admin Flow Validation. Requires a live backend
// (seeded Super Admin: admin@huemusebeauty.local / ChangeMe123!) — like
// every other e2e spec in this repo, this has been written and
// validated for syntax/logic but not executed live (see
// SPRINT_6B_VALIDATION.md's disclosure).

test("admin login page renders and is accessible", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Hue Muse Admin" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("rejects an invalid login with a visible error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("wrong@example.com");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
});

test("a successful login redirects to the dashboard and shows KPIs", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@huemusebeauty.local");
  await page.getByLabel("Password").fill("ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByText("Today's Orders")).toBeVisible();
});

test("an unauthenticated visit to a protected page redirects to login", async ({ page }) => {
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login/);
});
