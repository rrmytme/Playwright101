// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "results/junit.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "https://your-app.test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Example mobile web
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  // Optional: pre-auth global setup to save storage state files
  globalSetup: require.resolve("./config/global-setup"),
});
