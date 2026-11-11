/** Capture the real application; no AI-generated render is used as QA evidence.
 * Start the app, then: NYX_CAPTURE_URL=http://localhost:3110 node tools/capture-experience.mjs
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = process.env.NYX_CAPTURE_URL || "http://localhost:3110";
const evidence = resolve("docs/phase-5/evidence");
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1135 },
  });
  await page.goto(`${base}/casa-nodo`);
  await page
    .getByRole("button", { name: "Saludar", exact: true })
    .click({ trial: true, timeout: 60_000 });
  await page.getByRole("button", { name: "Pausar ambiente" }).click();
  await page.addStyleTag({
    content:
      ".nodo-header,.nodo-title,.nodo-console,.nodo-scene-label,.nodo-footer,nextjs-portal{visibility:hidden}",
  });
  const room = await page.locator(".nodo-viewport canvas").screenshot();
  await sharp(room)
    .webp({ quality: 88 })
    .toFile(
      resolve("public/assets/nyx/backgrounds/casa-nodo-after-hours.webp"),
    );
  await page.close();

  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 1000 },
    });
    await page.goto(base);
    await page
      .getByRole("button", { name: "Saludar a NYX" })
      .waitFor({ timeout: 60_000 });
    await page.addStyleTag({ content: "nextjs-portal{display:none}" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${evidence}/after-home-${width}.png` });
    await page.locator(".arrival-stage").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${evidence}/after-stage-${width}.png` });
    await page.locator(".studio-workbench").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Descargar PNG" }).waitFor();
    await page
      .locator(".studio-workbench")
      .screenshot({ path: `${evidence}/after-studio-${width}.png` });
    await page.goto(`${base}/casa-nodo`);
    await page
      .getByRole("button", { name: "Saludar", exact: true })
      .click({ trial: true, timeout: 60_000 });
    await page.addStyleTag({ content: "nextjs-portal{display:none}" });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${evidence}/after-casa-${width}.png` });
    await page.close();
  }
} finally {
  await browser.close();
}
