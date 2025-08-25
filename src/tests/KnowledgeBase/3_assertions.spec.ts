/*
Assertion types: 
1. auto retrying - retrying until timeout
2. non-retrying - no retrying, just check once
3. soft - failed soft assertions do not terminate test execution, but mark the test as failed.
4. hard - failed assertions terminate test execution immediately (default).
6.expect.poll - poll a action until it get expected outcome or timeout
7.expect.toPass - retry blocks of code until they are passing successfully
*/
import { test } from "@playwright/test";
import { expect as customExpect } from "../../utils/customAssertions";

test.describe("Assertions examples", () => {
  test("auto-retrying assertions", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await customExpect(page.getByText("Playwright")).toBeAttached();

    //------------------------start of tobe...() examples------------------------
    const locator1 = page.getByLabel("Subscribe to newsletter");
    await customExpect(locator1).toBeChecked();

    const locator2 = page.locator("button.submit");
    await customExpect(locator2).toBeEnabled();

    const locator2_1 = page.locator("button.submit");
    await customExpect(locator2_1).toBeDisabled();

    const locator3 = page.getByRole("textbox");
    await customExpect(locator3).toBeEditable();

    const locator4 = page.locator("div.warning");
    await customExpect(locator4).toBeEmpty();

    const locator5 = page.getByRole("textbox");
    await customExpect(locator5).toBeFocused();

    const locator6 = page.locator(".my-element");
    await customExpect(locator6).toBeHidden();

    const locator7 = page.getByRole("button");
    // Make sure at least some part of element intersects viewport.
    await customExpect(locator7).toBeInViewport();
    // Make sure element is fully outside of viewport.
    await customExpect(locator7).not.toBeInViewport();
    // Make sure that at least half of the element intersects viewport.
    await customExpect(locator7).toBeInViewport({ ratio: 0.5 });

    // A specific element is visible.
    await customExpect(page.getByText("Welcome")).toBeVisible();
    // At least one item in the list is visible.
    await customExpect(page.getByTestId("todo-item").first()).toBeVisible();
    // At least one of the two elements is visible, possibly both.
    await customExpect(
      page
        .getByRole("button", { name: "Sign in" })
        .or(page.getByRole("button", { name: "Sign up" }))
        .first()
    ).toBeVisible();

    const response = await page.request.get("https://playwright.dev");
    await customExpect(response).toBeOK(); //200-299
    await customExpect(response).not.toBeOK(); //400-599
    //------------------------end of tobe...() examples------------------------

    //------------------------start of toContain...() examples------------------------
    // Ensures the Locator points to an element with given CSS classes
    const locator8 = page.locator("#component");
    await customExpect(locator8).toContainClass("middle selected row");
    await customExpect(locator8).toContainClass("selected");
    await customExpect(locator8).toContainClass("row middle");
    // validate multiple classes
    const locator8_1 = page.locator(".list > .component");
    await customExpect(locator8_1).toContainClass([
      "inactive",
      "active",
      "inactive",
    ]);

    const locator9 = page.locator(".title");
    await customExpect(locator9).toContainText("substring");
    await customExpect(locator9).toContainText(/\d messages/); //regex
    await customExpect(page.locator("ul > li")).toContainText([
      "Text 1",
      "Text 3",
    ]); // check multiple values in a list of elements
    //------------------------end of toContain...() examples------------------------

    //------------------------start of toHave...() examples------------------------
    const locator10 = page.getByTestId("save-button");
    await customExpect(locator10).toHaveAccessibleDescription(
      "Save results to disk"
    );

    const locator11 = page.getByTestId("username-input");
    await customExpect(locator11).toHaveAccessibleErrorMessage(
      "Username is required."
    );

    const locator12 = page.getByTestId("save-button");
    await customExpect(locator12).toHaveAccessibleName("Save to disk");

    const locator13 = page.locator("input");
    await customExpect(locator13).toHaveAttribute("type", "text");
    // Assert attribute existence.
    await customExpect(locator13).toHaveAttribute("disabled");
    await customExpect(locator13).not.toHaveAttribute("open");

    // Ensures the Locator points to an element with given CSS classes
    const locator14 = page.locator("#component");
    await customExpect(locator14).toHaveClass("middle selected row"); // exact match
    await customExpect(locator14).toHaveClass(/(^|\s)selected(\s|$)/); // regex

    const list = page.locator("list > .component");
    await customExpect(list).toHaveCount(3); //validate number of elements in a list

    const locator15 = page.getByRole("button");
    await customExpect(locator15).toHaveCSS("display", "flex"); // validate the locator's CSS property

    const locator16 = page.getByRole("textbox");
    await customExpect(locator16).toHaveId("lastname"); // validate the locator's id attribute

    const locator17 = page.locator(".component");
    await customExpect(locator17).toHaveJSProperty("loaded", true); // validate the locator's JS property

    const locator18 = page.getByTestId("save-button");
    await customExpect(locator18).toHaveRole("button"); // validate the locator's role attribute
    /* Roles --> "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | 
    "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" 
    | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | 
    "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | 
    "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | 
    "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | 
    "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" 
    | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" 
    | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | 
    "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | 
    "tree" | "treegrid" | "treeitem"
     */

    // This function will wait until two consecutive locator screenshots yield the same result,
    // and then compare the last screenshot with the expectation.
    const locator19 = page.getByRole("button");
    await customExpect(locator19).toHaveScreenshot("image.png"); //page assertion
    await expect(page).toHaveScreenshot(); //full page assertion

    // Check for the page URL to be 'https://playwright.dev/docs/intro' (including query string)
    await expect(page).toHaveURL("https://playwright.dev/docs/intro");
    // Check for the page URL to contain 'doc', followed by an optional 's', followed by '/'
    await expect(page).toHaveURL(/docs?\//);
    // Check for the predicate to be satisfied
    // For example: verify query strings
    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.has("search") &&
        params.has("options") &&
        params.get("id") === "5"
      );
    });

    const locator20 = page.locator(".title");
    await customExpect(locator20).toHaveText(/Welcome, Test User/); // substring
    await customExpect(locator20).toHaveText(/Welcome, .*/); // regex
    await customExpect(locator20).toHaveText("Welcome, Test User"); // exact match

    // page assertions
    await expect(page).toHaveTitle(/.*checkout/); // regex
    await expect(page).toHaveTitle("Checkout - My Store"); // exact match

    const locator21 = page.locator("input[type=number]");
    await customExpect(locator21).toHaveValue(/[0-9]/); // regex
    await customExpect(locator21).toHaveValue("123"); // exact match

    const locator = page.locator("id=favorite-colors");
    await locator.selectOption(["R", "G"]); // select multiple options
    await customExpect(locator).toHaveValues([/R/, /G/]); // regex
    await customExpect(locator).toHaveValues(["R", "G"]); // exact match

    //------------------------end of toMatch...() examples------------------------
    // Asserts that the target element matches the given accessibility snapshot
    await customExpect(page.locator("body")).toMatchAriaSnapshot(`
  - heading "todos"
  - textbox "What needs to be done?"`); // inline snapshot

    await customExpect(page.locator("body")).toMatchAriaSnapshot(); // auto-named snapshot
    await customExpect(page.locator("body")).toMatchAriaSnapshot({
      name: "body.aria.yml",
    }); // specify file name

    // match the entire page to a snapshot
    expect(await page.screenshot()).toMatchSnapshot("landing-page.png");
    // Pass options to customize the snapshot comparison and have a generated name.
    expect(await page.screenshot()).toMatchSnapshot("landing-page.png", {
      maxDiffPixels: 27, // allow no more than 27 different pixels.
    });
    // Configure image matching threshold.
    expect(await page.screenshot()).toMatchSnapshot("landing-page.png", {
      threshold: 0.3,
    });
    // Bring some structure to your snapshot files by passing file path segments.
    expect(await page.screenshot()).toMatchSnapshot(["landing", "step2.png"]);
    expect(await page.screenshot()).toMatchSnapshot(["landing", "step3.png"]);
    // Configure image matching threshold and snapshot name.
    expect(await page.screenshot()).toMatchSnapshot({
      name: "landing-page.png",
      threshold: 0.3,
    });
  });

  test("non-retrying assertions", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Expect an attribute "to be" a value - non-retrying
    customExpect(
      await page.locator(".navbar__inner .navbar__title").getAttribute("href")
    ).toBe("/");

    // customExpect an element "to be visible" - non-retrying
    customExpect(
      await page.locator(".navbar__inner .navbar__title").isVisible()
    ).toBeTruthy();
  });

  test("soft assertions", async ({ page }, testInfo) => {
    await page.goto("https://playwright.dev/");

    // Soft assertions do not fail the test immediately.
    // All soft assertion results are collected and reported at the end of the test.
    // Make a few checks that will not stop the test when failed...
    await customExpect.soft(page.getByTestId("status")).toHaveText("Success");
    await customExpect.soft(page.getByTestId("eta")).toHaveText("1 day");

    // ... and continue the test to check more things.
    await page.getByRole("link", { name: "next page" }).click();
    await customExpect
      .soft(page.getByRole("heading", { name: "Make another order" }))
      .toBeVisible();

    // Avoid running further if there were soft assertion failures.
    customExpect(test.info().errors).toHaveLength(0);
  });

  test("expect.poll", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Polling until the condition is met or timeout occurs
    await customExpect
      .poll(
        async () => {
          return await page
            .locator(".navbar__inner .navbar__title")
            .textContent();
        },
        {
          message: "Navbar title did not update to expected value in time",
        }
      )
      .toBe("Playwright");
  });

  test("expect.toPass", async ({ page }) => {
    // Retry the block of code until it passes or timeout occurs
    await customExpect(async () => {
      const response = await page.request.get("https://playwright.dev/");
      customExpect(response.status()).toBe(200);
    }).toPass();

    //  custom timeout and retry intervals:
    await customExpect(async () => {
      const response = await page.request.get("https://api.example.com");
      customExpect(response.status()).toBe(200);
    }).toPass({
      // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
      // ... Defaults to [100, 250, 500, 1000].
      intervals: [1_000, 2_000, 10_000],
      timeout: 60_000,
    });
  });

  test("expect.configure", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    const locator_1 = page.getByRole("button", { name: "Submit" });
    const locator_2 = page.getByRole("button", { name: "Submit" });
    // Configure expect with custom timeout and interval
    const slowExpect = customExpect.configure({ timeout: 10000 });
    await slowExpect(locator_1).toHaveText("Submit");

    // Always do soft assertions.
    const softExpect = customExpect.configure({ soft: true });
    await softExpect(locator_2).toHaveText("Submit");
  });

  test("expect-customised assertions", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await customExpect(page.locator(".cart")).toHaveAmount(5, {
      timeout: 5000,
    });
  });
});
