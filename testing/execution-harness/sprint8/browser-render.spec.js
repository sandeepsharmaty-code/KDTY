// Sprint 8.1/8.5 — real Chromium execution (globally-installed Playwright,
// confirmed present at /opt/pw-browsers/) against the ACTUAL frontend
// design token source file, copied unmodified alongside this script.
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(__dirname, "test-page.html"));

  const bgColor = await page.locator("#cta").evaluate((el) => getComputedStyle(el).backgroundColor);
  const priceColor = await page.locator("#price").evaluate((el) => getComputedStyle(el).color);
  const results = [];
  results.push(["primary-plum token renders correctly in real Chromium", bgColor === "rgb(107, 34, 71)"]);
  results.push(["primary-rose token renders correctly in real Chromium", priceColor === "rgb(181, 72, 107)"]);

  const snapshot = await page.accessibility.snapshot();
  results.push(["real accessibility tree contains the button's accessible name", JSON.stringify(snapshot).includes("Add to Cart")]);
  const imgAlt = await page.locator("#product-img").getAttribute("alt");
  results.push(["real image alt text correctly read from rendered DOM", imgAlt === "Muse Rose Nail Lacquer bottle on a marble surface"]);

  for (const [name, pass] of results) console.log(`[${pass ? "PASS" : "FAIL"}] ${name}`);
  await browser.close();
  if (results.some(([, p]) => !p)) process.exit(1);
})();
