// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Directory for test files, you can give any directory name
  testDir: "./tests",

  // Run tests in parallel mode at the file level
  fullyParallel: true,

  // retry on failures: CI = 2 else local = 0
  retries: process.env.CI ? 2 : 0,

  // limit number of workers: CI = 4 else local = undefined
  workers: process.env.CI ? 4 : undefined,

  // Global timeout per test
  timeout: 30_000,

  // Expect assertion timeout
  expect: { timeout: 5_000 },

  // Test reporters
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    // other reporters you might consider:
    // ["junit", { outputFile: "results/junit.xml" }],
    // ["json", { outputFile: "results/results.json" }],
    // [
    //   "allure-playwright",
    //   { outputFolder: "results/allure-results", detail: true, suiteTitle: false },
    // ],
    // ["github"]
  ],

  // Shared settings for all the projects below
  use: {
    baseURL: process.env.BASE_URL ?? "https://your-app.test",
    trace: "on-first-retry", // options: off, on, on-first-retry, retain-on-failure
    screenshot: "only-on-failure", // options: off, on, only-on-failure, retain-on-failure
    video: "retain-on-failure", // options: off, on, record-on-first-retry, retain-on-failure
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000, // max time each action such as click can take
    ignoreHTTPSErrors: true, // ignore https errors in the browser
    // Base auth state for all tests, uncomment to use
    // storageState: 'config/storage/auth.json',
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // you can specify configuration options for this project/browser here
        // For using pre-auth state, uncomment below line
        // storageState: 'config/storage/auth.json'
        // headless: false, // uncomment to see the browser
        // slowMo: 500, // uncomment to slow down by 500ms
        // devtools: true, // uncomment to open devtools on each browser launch
      },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Example mobile web
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],

  // Optional: pre-auth global setup to save storage state files
  globalSetup: require.resolve("./config/global-setup"),
});
