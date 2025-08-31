// hooks-demo.spec.ts
import { test as base, expect } from "@playwright/test";
import mysql from "mysql2/promise";

// ---------- 1. beforeAll / afterAll (Global) ----------
let sharedToken: string;
let conn;

base.beforeAll(async ({ request }) => {
  console.log("Running beforeAll: acquiring global auth token and seeding DB");
  const res = await request.post("/auth", {
    data: { user: "admin", pass: "secret" },
  });
  sharedToken = (await res.json()).token;

  conn = await mysql.createConnection({
    /* creds */
  });
  await conn.query("CALL seed_test_data()");
});

base.afterAll(async () => {
  console.log("Running afterAll: cleaning DB and releasing resources");
  await conn.query("CALL cleanup_test_data()");
  await conn.end();
});

// ---------- 2. Fixtures ----------
type Fixtures = { adminToken: string };
const test = base.extend<Fixtures>({
  adminToken: [
    async ({}, use) => {
      await use(sharedToken);
    },
    { scope: "test" },
  ],
});

// ---------- 3. beforeEach / afterEach ----------
test.beforeEach(async ({ page }) => {
  console.log("Running beforeEach: logging in");
  await page.goto("/login");
  await page.fill("#username", "demo");
  await page.fill("#password", "demo123");
  await page.click("#loginBtn");
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(
    "Running afterEach: logging out and capturing diagnostics if failed"
  );
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title.replace(/\\s+/g, "_")}.png`,
      fullPage: true,
    });
    await testInfo.attach("page-source", {
      body: await page.content(),
      contentType: "text/html",
    });
  }
  await page.click("#logout");
});

// ---------- 4. Scoped Hooks in describe ----------
test.describe("Order management", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Scoped beforeEach: navigating to orders page");
    await page.goto("/orders");
  });

  test("can create order", async ({ page }) => {
    await page.click("#newOrder");
    await expect(page.locator(".order-status")).toHaveText("Created");
  });

  test("can cancel order", async ({ page }) => {
    await page.click(".order:first-child >> text=Cancel");
    await expect(page.locator(".order-status")).toHaveText("Cancelled");
  });
});

// ---------- 5. API test using adminToken fixture ----------
test("admin can list users", async ({ request, adminToken }) => {
  const res = await request.get("/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  expect(res.ok()).toBeTruthy();
});

// ---------- 6. describe confifure, Test step, only, skip, fixme ----------
test.describe.configure({ mode: "parallel" }); // or "serial", "default", "each"...
test.describe("Order management", () => {
  // Override baseURL for all tests in this describe block
  test.use({ baseURL: "https://staging.your-app.test" });
  test("can create order1", async ({ page }) => {
    test.step("Creating a new order1.1", async () => {
      await page.click("#newOrder");
      await expect(page.locator(".order-status")).toHaveText("Created");
    });
    test.step("Creating a new order1.2", async () => {
      await page.click("#newOrder");
      await expect(page.locator(".order-status")).toHaveText("Created");
    });
  });

  test.only("can create order2", async ({ page }) => {
    await page.click("#newOrder");
    await expect(page.locator(".order-status")).toHaveText("Created");
  });

  test.skip("can create order3", async ({ page }) => {
    await page.click("#newOrder");
    await expect(page.locator(".order-status")).toHaveText("Created");
  });

  test.fixme("can cancel order1", async ({ page }) => {
    await page.click(".order:first-child >> text=Cancel");
    await expect(page.locator("fix here")).toHaveText("Cancelled");
  });
});
