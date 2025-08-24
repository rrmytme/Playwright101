import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright"; // npm install @axe-core/playwright

test.describe("accessiblity testing examples", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/"); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4
    console.log(accessibilityScanResults.violations);
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });

  test("Exporting scan results as a test attachment", async ({
    page,
  }, testInfo) => {
    await page.goto("https://your-site.com/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("navigation menu should not have automatically detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/");
    await page.getByRole("button", { name: "Navigation Menu" }).click();

    // It is important to waitFor() the page to be in the desired
    // state *before* running analyze(). Otherwise, axe might not
    // find all the elements your test expects it to scan.
    await page.locator("#navigation-menu-flyout").waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("#navigation-menu-flyout")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have any automatically detectable WCAG A or AA violations", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
