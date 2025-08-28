// master control layer. Centralizes locators, waits, navigation, and API calls.

import { APIRequestContext, request, Page, expect } from "@playwright/test";

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
