// master control layer. Centralizes locators, waits, navigation, and API calls.

import { Page, Locator, test, expect } from "@playwright/test";

export default class Wrapper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ====== LOCATOR HELPERS ======
  public find(
    locator: string,
    options?: { frame?: string; has?: Locator; hasText?: string }
  ) {
    return options?.frame
      ? this.page
          .frameLocator(options.frame)
          .locator(locator, { has: options?.has, hasText: options?.hasText })
      : this.page.locator(locator, {
          has: options?.has,
          hasText: options?.hasText,
        });
  }

  public async findLocator(
    value: string,
    options?: {
      frame?: string;
      tabId?: number;
      timeOut?: number;
      has?: Locator;
      hasText?: string;
    }
  ): Promise<Locator> {
    // Decide which page to work with without mutating this.page
    let targetPage: Page = this.page;

    // Handle multiple tabs if tabId provided
    if (typeof options?.tabId === "number") {
      const pages = this.page.context().pages();
      if (options.tabId >= 0 && options.tabId < pages.length) {
        targetPage = pages[options.tabId];
      } else {
        throw new Error(
          `Invalid tabId: ${options.tabId} (found ${pages.length} open tabs)`
        );
      }
    }

    // Start with either a frame or the main page
    let locator: Locator;
    if (options?.frame) {
      locator = targetPage
        .frameLocator(options.frame)
        .locator(value, { has: options?.has, hasText: options?.hasText });
    } else {
      locator = targetPage.locator(value, {
        has: options?.has,
        hasText: options?.hasText,
      });
    }

    // Note: Locator does not have setTimeout; pass timeout to actions as needed
    // Example usage: await locator.click({ timeout: options?.timeOut });

    return locator;
  }

  public async fingByTestId(testId: string): Promise<Locator> {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  public async findByRole(
    role: Parameters<Page["getByRole"]>[0],
    name?: string
  ): Promise<Locator> {
    return this.page.getByRole(role, { name });
  }

  public async findByLabel(label: string): Promise<Locator> {
    return this.page.getByLabel(label);
  }

  public async findByPlaceholder(placeholder: string): Promise<Locator> {
    return this.page.getByPlaceholder(placeholder);
  }

  public async findByAltText(altText: string): Promise<Locator> {
    return this.page.getByAltText(altText);
  }

  public async findByTitle(title: string): Promise<Locator> {
    return this.page.getByTitle(title);
  }

  public async findByText(text: string): Promise<Locator> {
    return this.page.getByText(text, { exact: true });
  }

  locatorByText(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  public async getByAttribute(
    attribute: string,
    value: string
  ): Promise<Locator> {
    return this.page.locator(`[${attribute}="${value}"]`);
  }

  // ====== NAVIGATION ======
  public async goto(url: string) {
    await test.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url);
    });
  }
  public getUrl(): string {
    return this.page.url();
  }
  public async reloadPage() {
    if (!this.page)
      throw new Error("Page object not initialised for UI actions");
    await test.step("Reload current page", async () => {
      await this.page.reload();
    });
  }
  public async goBack() {
    if (!this.page)
      throw new Error("Page object not initialised for UI actions");
    await test.step("Navigate back", async () => {
      const response = await this.page.goBack();
      if (!response) console.warn("No previous page in history");
    });
  }
  public async goForward() {
    if (!this.page)
      throw new Error("Page object not initialised for UI actions");
    await test.step("Navigate forward", async () => {
      const response = await this.page.goForward();
      if (!response) console.warn("No forward page in history");
    });
  }

  // ====== HANDLE TABLE ======

  public async getTableRowCount(selector: string): Promise<number> {
    const rows = this.page.locator(`${selector} tbody tr`);
    return await rows.count();
  }

  public async getTableColumnCount(selector: string): Promise<number> {
    const columns = this.page.locator(`${selector} thead tr th`);
    return await columns.count();
  }

  public async getCellText(
    selector: string,
    rowIndex: number,
    colIndex: number
  ): Promise<string> {
    const cell = this.page
      .locator(`${selector} tbody tr`)
      .nth(rowIndex)
      .locator("td")
      .nth(colIndex);
    return (await cell.textContent()) ?? "";
  }

  public async getRowData(
    selector: string,
    rowIndex: number
  ): Promise<string[]> {
    const row = this.page.locator(`${selector} tbody tr`).nth(rowIndex);
    const cells = row.locator("td");
    const cellCount = await cells.count();
    const data: string[] = [];

    for (let i = 0; i < cellCount; i++) {
      data.push((await cells.nth(i).textContent()) ?? "");
    }

    return data;
  }

  public async findRowByCellText(
    selector: string,
    columnIndex: number,
    searchText: string
  ): Promise<number> {
    const rows = this.page.locator(`${selector} tbody tr`);
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const cell = rows.nth(i).locator("td").nth(columnIndex);
      const text = await cell.textContent();
      if (text?.trim() === searchText.trim()) {
        return i;
      }
    }

    throw new Error(
      `No row found with text "${searchText}" in column ${columnIndex}`
    );
  }

  // ====== Handle Tabs ======
  public async switchToTab(index: number): Promise<void> {
    if (!this.page) throw new Error("Page object not initialised");

    const pages = this.page.context().pages();
    if (index < 0 || index >= pages.length) {
      throw new Error(
        `Tab index ${index} is out of bounds. Found ${pages.length} tabs.`
      );
    }

    await test.step(`Switching to tab ${index}`, async () => {
      const targetPage = pages[index];
      await targetPage.bringToFront(); // Optional: visually focus tab
      this.page = targetPage;
    });
  }

  public async closeTab(options?: { tabId?: number }) {
    if (options?.tabId) {
      await this.page.context().pages()[options.tabId].close();
    } else {
      await this.page.close();
    }
  }

  public async getOpenTabsCount(): Promise<number> {
    return this.page.context().pages().length;
  }

  public async switchToLastTab(): Promise<void> {
    const pages = this.page.context().pages();
    await this.switchToTab(pages.length - 1);
  }

  public async switchToFirstTab(): Promise<void> {
    await this.switchToTab(0);
  }

  public async switchToNextTab(): Promise<void> {
    const pages = this.page.context().pages();
    const currentIndex = pages.indexOf(this.page);
    const nextIndex = (currentIndex + 1) % pages.length;
    await this.switchToTab(nextIndex);
  }

  public async switchToPreviousTab(): Promise<void> {
    const pages = this.page.context().pages();
    const currentIndex = pages.indexOf(this.page);
    const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
    await this.switchToTab(prevIndex);
  }

  public async closeCurrentTabAndSwitchTo(index: number): Promise<void> {
    await this.page.close();
    await this.switchToTab(index);
  }

  public async closeAllTabsExcept(index: number): Promise<void> {
    const pages = this.page.context().pages();
    for (let i = 0; i < pages.length; i++) {
      if (i !== index) {
        await pages[i].close();
      }
    }
    await this.switchToTab(index);
  }

  // ====== HANDLE FRAMES ======
  public async switchToFrame(nameOrSelector: string): Promise<void> {
    if (!this.page) throw new Error("Page object not initialised");

    await test.step(`Switching to frame: ${nameOrSelector}`, async () => {
      const frame =
        this.page.frame({ name: nameOrSelector }) ??
        this.page.frame({ url: new RegExp(nameOrSelector) });

      if (!frame) throw new Error(`Frame '${nameOrSelector}' not found`);
      // You cannot assign a Frame to this.page (which is a Page), so consider storing the frame in a separate property if needed.
      // Example: this.currentFrame = frame;
    });
  }

  public async switchToMainFrame(): Promise<void> {
    if (!this.page) throw new Error("Page object not initialised");
    await test.step("Switching to main frame", async () => {
      // No action needed; just a placeholder to indicate switching back to main frame
      // Example: this.currentFrame = null; // if you were storing the current frame
    });
  }

  public async getFrameByName(name: string) {
    const frame = this.page.frame({ name });
    if (!frame) throw new Error(`Frame with name '${name}' not found`);
    return frame;
  }

  public async getFrameByUrl(url: string | RegExp) {
    const frame = this.page.frame({ url });
    if (!frame) throw new Error(`Frame with URL '${url}' not found`);
    return frame;
  }

  public async getAllFrames() {
    return this.page.frames();
  }

  // ====== UI ACTIONS ======
  public async click(locator: string) {
    await test.step(`Click on ${locator}`, async () => {
      await this.find(locator).click();
    });
  }
  public async type(locator: string, text: string) {
    await test.step(`Type into ${locator}`, async () => {
      await this.find(locator).fill(text);
    });
  }
  public async selectDropdown(locator: string, value: string) {
    await this.find(locator).selectOption(value);
  }

  // ====== WAITS ======
  public async waitForVisible(locator: string, timeout = 5000) {
    await this.find(locator).waitFor({ state: "visible", timeout });
  }
  public async waitForUrl(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }

  // ====== ASSERTIONS ======
  public async expectVisible(locator: string) {
    await expect(this.find(locator)).toBeVisible();
  }
  public async expectText(locator: string, expected: string) {
    await expect(this.find(locator)).toHaveText(expected);
  }

  // ====== SCREENSHOTS ======
  public async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
