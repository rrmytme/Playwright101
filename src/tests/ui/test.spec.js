import { test, expect } from "@playwright/test";

test("basic test", async ({ page, testInfo }) => {
  testInfo.setTimeout(120000);
  testInfo.annotations.push({ type: "component", description: "ui" });
  testInfo.description = "this is a basic test";
  testInfo.title = "basic test example";
  testInfo.annotations.push({ type: "priority", description: "high" });
  await page.goto("https://playwright.dev/");
  const title = page.locator(".navbar__inner .navbar__title");
  await expect(title).toHaveText("Playwright");
});

test("Capture screenshot on failure", async ({ page }, testInfo) => {
  await page.goto("https://yourapp.com");
  try {
    await expect(page.locator("h1")).toHaveText("Wrong Title");
  } catch (error) {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
      await page.video().saveAs(`videos/${testInfo.title}.webm`);
    throw error;
    }
    page.frameLocator('iframe[name="iframe-name"]');
    page.frame({ name: 'iframe-name' });
    page.frame({ url: /.*domain.*/ });
    page.frames();
});
