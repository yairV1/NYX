import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const report = { layouts: [], errors: [], requests: [] };
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: "artifacts/orbis/video",
      size: { width: 1440, height: 900 },
    },
  });
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().includes("compressed.mp4"))
      report.requests.push({ url: r.url(), status: r.status() });
  });
  // Chromium headless synthesizes a (0,0) mousemove during navigation.
  // Suppress automation pointer events only while checking the no-input state.
  await page.addInitScript(() => {
    window.qaInput = false;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (!window.qaInput) e.stopImmediatePropagation();
      },
      true,
    );
  });
  await page.goto("http://localhost:3120/orbis/");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("video")].every((v) => v.readyState >= 2),
    {},
    { timeout: 90000 },
  );
  await page.waitForFunction(() => document.documentElement.className === "");
  const state = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("video")].map((v) => ({
        id: v.id,
        time: v.currentTime,
        duration: v.duration,
        paused: v.paused,
        opacity: getComputedStyle(v).opacity,
        active: v.classList.contains("is-active"),
      })),
    );
  report.initial = await state();
  if (report.initial.some((v) => !v.paused || v.time !== 0))
    throw Error("Initial pose not paused at zero");
  console.log("Loaded videos", report.initial);
  await page.screenshot({ path: "docs/orbis/evidence/desktop.png" });
  await page.evaluate(() => (window.qaInput = true));
  for (const x of [1250, 720, 180, 720]) {
    await page.mouse.move(x, 450);
    await page.waitForFunction(() =>
      [...document.querySelectorAll("video")].every((v) => !v.seeking),
    );
    await page.waitForTimeout(400);
    report[`x${x}`] = await state();
  }
  // Repeated rapid crossing must remain paused and permanently opaque.
  for (let i = 0; i < 30; i++) await page.mouse.move(i % 2 ? 80 : 1360, 400);
  await page.waitForTimeout(1500);
  await page.mouse.move(720, 450);
  await page.waitForTimeout(500);
  report.afterSweep = await state();
  report.hintGone = await page
    .locator(".hint")
    .evaluate((el) => getComputedStyle(el).opacity === "0");
  for (const width of [320, 375, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.evaluate(() => document.fonts.ready);
    report.layouts.push(
      await page.evaluate(() => ({
        width: innerWidth,
        h: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        headline: [...document.querySelectorAll(".line-a,.line-b")].map((e) => {
          const b = e.getBoundingClientRect();
          return { x: b.x, right: b.right, y: b.y, bottom: b.bottom };
        }),
      })),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/orbis/evidence/mobile.png" });
  await page.getByRole("button", { name: "Open menu" }).click();
  if (!(await page.locator("#sheet").isVisible()))
    throw Error("Sheet not visible");
  await page.screenshot({ path: "docs/orbis/evidence/menu.png" });
  await page.keyboard.press("Escape");
  if (await page.locator("#sheet").isVisible())
    throw Error("Escape did not close");
  if (
    !(await page
      .getByRole("button", { name: "Open menu" })
      .evaluate((e) => e === document.activeElement))
  )
    throw Error("Focus not restored");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#sheet")
    .getByRole("button", { name: "Crew", exact: true })
    .click();
  if (await page.locator("#sheet").isVisible())
    throw Error("Link did not close");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.mouse.click(10, 700);
  if (await page.locator("#sheet").isVisible())
    throw Error("Outside click did not close");
  report.menu = "escape / focus / link / outside pass";
  await page.close();
  const quiet = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await quiet.goto("http://localhost:3120/orbis/");
  await quiet.waitForFunction(() =>
    [...document.querySelectorAll("video")].every((v) => v.readyState >= 2),
  );
  await quiet.mouse.move(1400, 500);
  await quiet.waitForTimeout(500);
  report.reducedMotion = await quiet.evaluate(() => ({
    className: document.documentElement.className,
    still: [...document.querySelectorAll("video")].every(
      (v) => v.paused && v.currentTime === 0,
    ),
    hint: getComputedStyle(document.querySelector(".hint")).display,
  }));
  await quiet.close();
  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await touch.goto("http://localhost:3120/orbis/");
  await touch.waitForFunction(() =>
    [...document.querySelectorAll("video")].every((v) => v.readyState >= 2),
  );
  await touch.touchscreen.tap(300, 600);
  await touch.waitForTimeout(250);
  report.touch = await touch.evaluate(() =>
    [...document.querySelectorAll("video")].every(
      (v) => v.paused && v.currentTime === 0,
    ),
  );
  if (!report.touch) throw Error("Touch moved video");
  await touch.close();
  await writeFile(
    "docs/orbis/evidence/checks.json",
    JSON.stringify(report, null, 2),
  );
  if (
    report.errors.length ||
    report.layouts.some((l) => l.scrollWidth > l.width || l.scrollHeight > l.h)
  )
    throw Error("Layout/page errors");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
