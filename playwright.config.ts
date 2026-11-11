import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.NYX_TEST_URL || "http://127.0.0.1:3111",
    viewport: { width: 1440, height: 1000 },
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.NYX_TEST_URL
    ? undefined
    : {
        command: "npm run dev -- --port 3111",
        url: "http://127.0.0.1:3111",
        reuseExistingServer: !process.env.CI,
      },
});
