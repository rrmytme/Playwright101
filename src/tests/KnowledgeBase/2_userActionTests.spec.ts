import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Actions example tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc/");
  });

  test("Text inputs", async ({ page }) => {
    // Text input
    await page.getByRole("textbox").fill("Peter");
    // Date input
    await page.getByLabel("Birth date").fill("2020-02-02");
    // Time input
    await page.getByLabel("Appointment time").fill("13:15");
    // Local datetime input
    await page.getByLabel("Local time").fill("2020-03-02T05:15");
  });

  test("Checkboxes and radio buttons", async ({ page }) => {
    // Check the checkbox
    await page.getByLabel("I agree to the terms above").check();
    // Assert the checked state
    expect(page.getByLabel("Subscribe to newsletter")).toBeChecked();
    // Select the radio button
    await page.getByLabel("XL").check();
  });

  test("Select options", async ({ page }) => {
    // Single selection matching the value or label
    await page.getByLabel("Choose a color").selectOption("blue");
    // Single selection matching the label
    await page.getByLabel("Choose a color").selectOption({ label: "Blue" });
    // Multiple selected items
    await page
      .getByLabel("Choose multiple colors")
      .selectOption(["red", "green", "blue"]);
  });

  test("Mouse click", async ({ page }) => {
    // Generic click
    await page.getByRole("button").click();
    // Force click
    await page.getByRole("button").click({ force: true });
    // programmatic click
    await page.getByRole("button").dispatchEvent("click");
    // Double click
    await page.getByText("Item").dblclick();
    // Right click
    await page.getByText("Item").click({ button: "right" });
    // Shift + click
    await page.getByText("Item").click({ modifiers: ["Shift"] });
    // Ctrl + click on Windows and Linux
    // Meta + click on macOS
    await page.getByText("Item").click({ modifiers: ["ControlOrMeta"] });
    // Hover over element
    await page.getByText("Item").hover();
    // Click the top left corner
    await page.getByText("Item").click({
      position: { x: 0, y: 0 },
    });
    // Press keys one by one
    await page.locator("#area").pressSequentially("Hello World!");
  });

  test("Keys and shortcuts", async ({ page }) => {
    // Hit Enter
    await page.getByText("Submit").press("Enter");
    // Dispatch Control+Right
    await page.getByRole("textbox").press("Control+ArrowRight");
    // Press $ sign on keyboard
    await page.getByRole("textbox").press("$");
  });

  test("file uploads", async ({ page }) => {
    // Select one file
    await page
      .getByLabel("Upload file")
      .setInputFiles(path.join(__dirname, "myfile.pdf"));
    // Select multiple files
    await page
      .getByLabel("Upload files")
      .setInputFiles([
        path.join(__dirname, "file1.txt"),
        path.join(__dirname, "file2.txt"),
      ]);
    // Select a directory
    await page
      .getByLabel("Upload directory")
      .setInputFiles(path.join(__dirname, "mydir"));
    // Remove all the selected files
    await page.getByLabel("Upload file").setInputFiles([]);
    // Upload buffer from memory
    await page.getByLabel("Upload file").setInputFiles({
      name: "file.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("this is test"),
    });
  });

  test("focus elements", async ({ page }) => {
    await page.getByLabel("Password").focus();
  });

  test("Drag and Drop", async ({ page }) => {
    await page
      .locator("#item-to-be-dragged")
      .dragTo(page.locator("#item-to-drop-at"));
    // Alternative way using drag and drop
    await page.locator("#item-to-be-dragged").hover();
    await page.mouse.down();
    await page.locator("#item-to-drop-at").hover();
    await page.mouse.up();
  });

  test("Scrolling", async ({ page }) => {
    // Scrolls automatically so that button is visible
    await page.getByRole("button").click();
    // Scroll the footer into view, forcing an "infinite list" to load more content
    await page.getByText("Footer text").scrollIntoViewIfNeeded();
    // Position the mouse and scroll with the mouse wheel
    await page.getByTestId("scrolling-container").hover();
    await page.mouse.wheel(0, 10);
    // Alternatively, programmatically scroll a specific element
    await page
      .getByTestId("scrolling-container")
      .evaluate((e) => (e.scrollTop += 100));
  });
});
