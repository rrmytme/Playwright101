// tests/catalog/mocks.spec.ts
import { test, expect } from "@playwright/test";

test("catalog shows fallback when API fails", async ({ page }) => {
  await page.route("**/api/catalog", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "boom" }),
    })
  );
  await page.goto("/catalog");
  await expect(
    page.getByText("We’re having trouble loading products")
  ).toBeVisible();
});

test("catalog shows products when API succeeds", async ({ page }) => {
  await page.route("**/api/catalog", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ]),
    })
  );
  await page.goto("/catalog");
  await expect(page.getByText("Product 1")).toBeVisible();
  await expect(page.getByText("Product 2")).toBeVisible();
});
