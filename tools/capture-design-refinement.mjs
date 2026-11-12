/** Real-browser design evidence. Start localhost:3110 before running. */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const root = "docs/design-refinement/evidence";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader"],
});
const report = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://localhost:3110");
    await page
      .getByRole("button", { name: "Saludar a NYX" })
      .waitFor({ timeout: 90000 });
    await page.getByRole("button", { name: "Pausar", exact: true }).click();
    await page.addStyleTag({
      content:
        "nextjs-portal{display:none} html{scroll-behavior:auto!important}",
    });
    await page.screenshot({ path: `${root}/after-home-${width}.png` });
    await page.locator(".arrival-stage").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${root}/after-world-${width}.png` });
    await page
      .locator("#que-es-nyx")
      .evaluate((el) =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.screenshot({ path: `${root}/after-identity-${width}.png` });
    for (const name of ["Su mochila", "Su saludo", "Conócelo"]) {
      await page.getByRole("button", { name, exact: true }).click();
      const img = page.locator("#que-es-nyx figure img");
      await img.evaluate((el) => el.decode());
      if (
        (await page
          .getByRole("button", { name, exact: true })
          .getAttribute("aria-pressed")) !== "true"
      )
        throw Error("Portrait selection");
    }
    await page
      .locator("#ecosistema")
      .evaluate((el) =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.screenshot({ path: `${root}/after-ecosystem-${width}.png` });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    report.push({ width, overflow, errors, portraits: "three images decoded" });
    await page.goto("http://localhost:3110/casa-nodo");
    await page
      .getByRole("button", { name: "Saludar", exact: true })
      .click({ trial: true, timeout: 90000 });
    await page.getByRole("button", { name: "Pausar ambiente" }).click();
    await page.addStyleTag({
      content:
        "nextjs-portal{display:none} html{scroll-behavior:auto!important}",
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `${root}/after-casa-${width}.png` });
    if (width === 1440) {
      const pixels = await page.locator(".nodo-viewport canvas").screenshot();
      await sharp(pixels)
        .resize(1600, 1000, { fit: "contain", background: "#080d18" })
        .webp({ quality: 88 })
        .toFile("public/assets/nyx/backgrounds/casa-nodo-after-hours.webp");
    }
    await page.close();
  }
  await writeFile(
    `${root}/browser-review.json`,
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}
