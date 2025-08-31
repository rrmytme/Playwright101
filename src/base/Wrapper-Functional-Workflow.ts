// master control layer. Centralizes locators, waits, navigation, and API calls.
// Functional workflow version

import {
  APIRequestContext,
  request,
  Page,
  Locator,
  test,
  expect,
} from "@playwright/test";

// ====== INIT ======
export async function initApiContext(
  baseURL: string,
  extraHeaders?: Record<string, string>
) {
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: extraHeaders,
  });
}

// ====== LOCATOR HELPERS ======
export function find(
  page: Page,
  locator: string,
  options?: { frame?: string; has?: Locator; hasText?: string }
) {
  return options?.frame
    ? page
        .frameLocator(options.frame)
        .locator(locator, { has: options?.has, hasText: options?.hasText })
    : page.locator(locator, {
        has: options?.has,
        hasText: options?.hasText,
      });
}

export async function findLocator(
  page: Page,
  value: string,
  options?: {
    frame?: string;
    tabId?: number;
    timeOut?: number;
    has?: Locator;
    hasText?: string;
  }
): Promise<Locator> {
  let targetPage: Page = page;
  if (typeof options?.tabId === "number") {
    const pages = page.context().pages();
    if (options.tabId >= 0 && options.tabId < pages.length) {
      targetPage = pages[options.tabId];
    } else {
      throw new Error(
        `Invalid tabId: ${options.tabId} (found ${pages.length} open tabs)`
      );
    }
  }
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
  return locator;
}

export function locatorByText(page: Page, text: string): Locator {
  return page.getByText(text, { exact: true });
}

// ====== NAVIGATION ======
export async function goto(page: Page, url: string) {
  await test.step(`Navigate to ${url}`, async () => {
    await page.goto(url);
  });
}
export function getUrl(page: Page): string {
  return page.url();
}
export async function reloadPage(page: Page) {
  if (!page) throw new Error("Page object not initialised for UI actions");
  await test.step("Reload current page", async () => {
    await page.reload();
  });
}
export async function goBack(page: Page) {
  if (!page) throw new Error("Page object not initialised for UI actions");
  await test.step("Navigate back", async () => {
    const response = await page.goBack();
    if (!response) console.warn("No previous page in history");
  });
}
export async function goForward(page: Page) {
  if (!page) throw new Error("Page object not initialised for UI actions");
  await test.step("Navigate forward", async () => {
    const response = await page.goForward();
    if (!response) console.warn("No forward page in history");
  });
}

// ====== Handle Tabs ======
export async function closeTab(page: Page, options?: { tabId?: number }) {
  if (options?.tabId !== undefined) {
    await page.context().pages()[options.tabId].close();
  } else {
    await page.close();
  }
}

// ====== UI ACTIONS ======
export async function click(page: Page, locator: string) {
  await test.step(`Click on ${locator}`, async () => {
    await find(page, locator).click();
  });
}
export async function type(page: Page, locator: string, text: string) {
  await test.step(`Type into ${locator}`, async () => {
    await find(page, locator).fill(text);
  });
}
export async function selectDropdown(
  page: Page,
  locator: string,
  value: string
) {
  await find(page, locator).selectOption(value);
}

// ====== WAITS ======
export async function waitForVisible(
  page: Page,
  locator: string,
  timeout = 5000
) {
  await find(page, locator).waitFor({ state: "visible", timeout });
}
export async function waitForUrl(page: Page, pattern: string | RegExp) {
  await page.waitForURL(pattern);
}

// ====== ASSERTIONS ======
export async function expectVisible(page: Page, locator: string) {
  await expect(find(page, locator)).toBeVisible();
}
export async function expectText(
  page: Page,
  locator: string,
  expected: string
) {
  await expect(find(page, locator)).toHaveText(expected);
}

// ====== SCREENSHOTS ======
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `screenshots/${name}.png`,
    fullPage: true,
  });
}

// ====== API ACTIONS ======
export async function apiGet(
  apiContext: APIRequestContext,
  endpoint: string,
  options?: any
) {
  const res = await apiContext.get(endpoint, options);
  return res;
}
export async function apiPost(
  apiContext: APIRequestContext,
  endpoint: string,
  body: any,
  options?: any
) {
  const res = await apiContext.post(endpoint, {
    data: body,
    ...options,
  });
  return res;
}
export async function apiPut(
  apiContext: APIRequestContext,
  endpoint: string,
  body: any,
  options?: any
) {
  const res = await apiContext.put(endpoint, {
    data: body,
    ...options,
  });
  return res;
}
export async function apiDelete(
  apiContext: APIRequestContext,
  endpoint: string,
  options?: any
) {
  const res = await apiContext.delete(endpoint, options);
  return res;
}
export async function expectStatus(response, code: number) {
  expect(response.status()).toBe(code);
}
export async function expectJsonSchema(response, schema: any) {
  const body = await response.json();
  // Example: Ajv schema validation could be plugged in here
  expect(body).toMatchObject(schema);
}

// ====== CROSS-LAYER ======
export async function loginViaApiAndContinueInUI(
  apiContext: APIRequestContext,
  page: Page,
  credentials
) {
  const loginRes = await apiPost(apiContext, "/login", credentials);
  await expectStatus(loginRes, 200);
  const cookies = await apiContext.storageState();
  await page.context().addCookies(cookies.cookies);
}
