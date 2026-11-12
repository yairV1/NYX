/** Convert actual Blender renders. Run after both identity renders and posters. */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const input = "artifacts/design-refinement";
const evidence = "docs/design-refinement/evidence";
await mkdir(evidence, { recursive: true });
for (const name of ["portrait", "wave", "back"]) {
  await sharp(`${input}/after-v2/${name}.png`)
    .webp({ quality: 90 })
    .toFile(`public/assets/nyx/character/identity-${name}.webp`);
}
for (const name of ["idle", "wave"]) {
  await sharp(`${input}/posters-v2/${name}.png`)
    .webp({ quality: 90 })
    .toFile(`public/assets/nyx/character/nyx-3d-${name}.webp`);
}
for (const name of ["neutral", "back", "portrait", "wave"]) {
  const before = await sharp(`${input}/before/${name}.png`)
    .resize(500, 500)
    .flatten({ background: "#0f172a" })
    .toBuffer();
  const after = await sharp(`${input}/after-v2/${name}.png`)
    .resize(500, 500)
    .flatten({ background: "#0f172a" })
    .toBuffer();
  const labels = Buffer.from(
    '<svg width="1000" height="48"><rect width="1000" height="48" fill="#0f172a"/><g fill="#e5e7eb" font-family="sans-serif" font-size="18"><text x="20" y="30">ANTES</text><text x="520" y="30">DESPUÉS</text></g></svg>',
  );
  await sharp({
    create: { width: 1000, height: 548, channels: 3, background: "#0f172a" },
  })
    .composite([
      { input: labels, top: 0, left: 0 },
      { input: before, left: 0, top: 48 },
      { input: after, left: 500, top: 48 },
    ])
    .webp({ quality: 90 })
    .toFile(`${evidence}/compare-${name}.webp`);
}
