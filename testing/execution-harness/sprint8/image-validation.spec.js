// Sprint 8.6 — real image generation (globally-installed `sharp`) and
// measurement, fed into the ACTUAL Sprint 7.3 media validator (compiled
// via the same tsc technique as Sprint 7.6's harness).
const sharp = require("/home/claude/.npm-global/lib/node_modules/sharp");
const fs = require("fs");
const path = require("path");
const { validateMedia } = require("/tmp/e2e-harness/dist/content-validation/validators/media.validator.js");

(async () => {
  const results = [];
  const largePath = "/tmp/browser-test/real-product-image.jpg";
  const tinyPath = "/tmp/browser-test/real-tiny-image.jpg";
  await sharp({ create: { width: 1200, height: 1200, channels: 3, background: { r: 200, g: 150, b: 160 } } }).jpeg({ quality: 90 }).toFile(largePath);
  await sharp({ create: { width: 200, height: 200, channels: 3, background: { r: 100, g: 100, b: 100 } } }).jpeg().toFile(tinyPath);

  const bigMeta = await sharp(largePath).metadata();
  const bigStat = fs.statSync(largePath);
  const tinyMeta = await sharp(tinyPath).metadata();

  const largeResult = validateMedia({ url: "real-product-image.jpg", altText: "A real description", widthPx: bigMeta.width, heightPx: bigMeta.height, fileSizeBytes: bigStat.size, isReferencedByAnyEntity: true });
  const tinyResult = validateMedia({ url: "real-tiny-image.jpg", altText: "A real description", widthPx: tinyMeta.width, heightPx: tinyMeta.height, isReferencedByAnyEntity: true });

  results.push(["a real 1200x1200 generated+measured image passes dimension validation", !largeResult.some((i) => i.code === "MEDIA_DIMENSIONS_TOO_SMALL")]);
  results.push(["a real 200x200 generated+measured image correctly FAILS dimension validation", tinyResult.some((i) => i.code === "MEDIA_DIMENSIONS_TOO_SMALL")]);

  for (const [name, pass] of results) console.log(`[${pass ? "PASS" : "FAIL"}] ${name}`);
  if (results.some(([, p]) => !p)) process.exit(1);
})();
