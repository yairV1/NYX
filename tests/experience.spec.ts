import { test, expect } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`landing composes without horizontal clipping at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "curioso",
    );
    await expect(
      page.getByRole("button", { name: "Saludar a NYX" }),
    ).toBeVisible();
    await expect(page.locator(".arrival-copy")).toBeInViewport();
    await page.locator(".arrival-stage").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => window.scrollX)).toBe(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 1024) {
      await page.getByRole("button", { name: "Abrir menú" }).click();
      await expect(
        page.getByRole("navigation", { name: "Principal, móvil" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("navigation", { name: "Principal, móvil" }),
      ).toBeHidden();
    }
    expect(errors).toEqual([]);
  });
}

test("Studio edits, remembers the draft and exports a real PNG", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#studio");
  await page.getByLabel("Tu mensaje").fill("Mi universo NYX");
  await page.getByLabel("Una línea más").fill("Mi primera creación.");
  await page.getByRole("button", { name: "Aurora", exact: true }).click();
  await page.getByRole("button", { name: "Cuadrado", exact: true }).click();
  await expect(page.locator(".studio-canvas-wrap canvas")).toHaveAttribute(
    "height",
    "1600",
  );
  await page.reload();
  await expect(page.getByLabel("Tu mensaje")).toHaveValue("Mi universo NYX");
  await expect(
    page.getByRole("button", { name: "Aurora", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".studio-canvas-wrap canvas")).toHaveAttribute(
    "height",
    "1600",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("nyx-studio-aurora-square.png");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const png = Buffer.concat(chunks);
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(png.readUInt32BE(16)).toBe(1600);
  expect(png.readUInt32BE(20)).toBe(1600);
  expect(png.length).toBeGreaterThan(20_000);
});

test("Casa Nodo has real controls and returns to idle after a reaction", async ({
  page,
}) => {
  await page.goto("/casa-nodo");
  const wave = page.getByRole("button", { name: "Saludar", exact: true });
  await expect(wave).toBeEnabled();
  await wave.click();
  await expect(wave).toHaveAttribute("aria-pressed", "true");
  await expect(wave).toHaveAttribute("aria-pressed", "false", {
    timeout: 30_000,
  });
  await page.getByRole("button", { name: "Lámpara encendida" }).click();
  await expect(
    page.getByRole("button", { name: "Lámpara apagada" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "02 El escritorio" }).click();
  await expect(
    page.getByRole("link", { name: "Crear en el lienzo de Studio" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Aurora", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Aurora", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pausar ambiente" }).click();
  await expect(
    page.getByRole("button", { name: "Reanudar ambiente" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Restablecer cámara" }).click();
  await expect(
    page.getByRole("button", { name: "01 Conoce a NYX" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion starts with the room poster and lets visitors opt in", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".arrival-stage canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Explorar en 3D" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explorar en 3D" }).click();
  await expect(
    page.getByRole("button", { name: "Saludar a NYX" }),
  ).toBeVisible();
});

test("a lost WebGL context restores the poster after the scene was ready", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Saludar a NYX" }),
  ).toBeVisible();
  await page.locator(".arrival-stage canvas").evaluate((element) => {
    const context = (element as HTMLCanvasElement).getContext("webgl2");
    const extension = context?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Test browser lacks WEBGL_lose_context");
    extension.loseContext();
  });
  await expect(page.locator(".arrival-poster")).not.toHaveClass(/is-hidden/);
  await expect(
    page.getByText("Vista de respaldo", { exact: true }),
  ).toBeVisible();
});
