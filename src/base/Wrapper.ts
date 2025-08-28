// master control layer. Centralizes locators, waits, navigation, and API calls.

import {
  APIRequestContext,
  request,
  Page,
  Locator,
  test,
  expect,
} from "@playwright/test";

export default class Wrapper {
  private page: Page;
  private apiContext: APIRequestContext;

  constructor(page: Page) {
    this.page = page;
  }

  // ====== INIT ======
  public static async initApiContext(
    baseURL: string,
    extraHeaders?: Record<string, string>
  ) {
    return await request.newContext({
      baseURL,
      extraHTTPHeaders: extraHeaders,
    });
  }
  public setApiContext(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
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

  locatorByText(text: string): Locator {
    return this.page.getByText(text, { exact: true });
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

  // ====== Handle Tabs ======
  public async closeTab(options?: { tabId?: number }) {
    if (options?.tabId) {
      await this.page.context().pages()[options.tabId].close();
    } else {
      await this.page.close();
    }
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

  // ====== API ACTIONS ======
  public async apiGet(endpoint: string, options?: any) {
    const res = await this.apiContext.get(endpoint, options);
    return res;
  }
  public async apiPost(endpoint: string, body: any, options?: any) {
    const res = await this.apiContext.post(endpoint, {
      data: body,
      ...options,
    });
    return res;
  }
  public async apiPut(endpoint: string, body: any, options?: any) {
    const res = await this.apiContext.put(endpoint, {
      data: body,
      ...options,
    });
    return res;
  }
  public async apiDelete(endpoint: string, options?: any) {
    const res = await this.apiContext.delete(endpoint, options);
    return res;
  }
  public async expectStatus(response, code: number) {
    expect(response.status()).toBe(code);
  }
  public async expectJsonSchema(response, schema: any) {
    const body = await response.json();
    // Example: Ajv schema validation could be plugged in here
    expect(body).toMatchObject(schema);
  }

  // ====== CROSS-LAYER ======
  public async loginViaApiAndContinueInUI(credentials) {
    const loginRes = await this.apiPost("/login", credentials);
    this.expectStatus(loginRes, 200);
    const cookies = await this.apiContext.storageState();
    await this.page.context().addCookies(cookies.cookies);
  }
}
