import { APIResponse } from "@playwright/test";
import { test, expect } from "@playwright/test";

let id: string;
test.describe.configure({ mode: "serial" });
test.describe("API Tests with Wrapper Class", () => {
  // APIRequest Context instance
  // APIRequestContext is created in the Wrapper class and can be used in requests
  // request is a built-in fixture from Playwright Test that provides an APIRequestContext instance
  // Here we are using the built-in request fixture for simplicity
  // In a real-world scenario, you might want to initialize it in a more controlled manner

  const baseURL = "https://api.restful-api.dev";

  test("get all object", async ({ request }) => {
    const response: APIResponse = await request.get(`${baseURL}/objects`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });

  test("get single object", async ({ request }) => {
    const response: APIResponse = await request.get(`${baseURL}/objects/1`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", "1");
  });

  test("create new object", async ({ request }) => {
    const newObject = {
      name: "Apple MacBook Pro 16",
      data: {
        year: 2019,
        price: 1849.99,
        "CPU model": "Intel Core i9",
        "Hard disk size": "1 TB",
      },
    };
    const response: APIResponse = await request.post(`${baseURL}/objects`, {
      data: newObject,
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(newObject);
    expect(responseBody).toHaveProperty("id");
    id = responseBody.id;
  });

  test("update object", async ({ request }) => {
    const updatedObject = {
      name: "Apple MacBook Pro 16",
      data: {
        year: 2019,
        price: 2049.99,
        "CPU model": "Intel Core i9",
        "Hard disk size": "1 TB",
        color: "silver",
      },
    };
    const response: APIResponse = await request.put(
      `${baseURL}/objects/${id}`,
      {
        data: updatedObject,
      }
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(updatedObject);
    expect(responseBody).toHaveProperty("id", id);
  });

  test("partial update object", async ({ request }) => {
    const partialUpdate = {
      data: { name: "Apple MacBook Pro 16 (Updated Name)" },
    };
    const response: APIResponse = await request.patch(
      `${baseURL}/objects/${id}`,
      {
        data: partialUpdate,
      }
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toMatchObject(partialUpdate.data);
    expect(responseBody).toHaveProperty("id", id);
  });

  test("delete object", async ({ request }) => {
    const response: APIResponse = await request.delete(
      `${baseURL}/objects/${id}`
    );
    expect(response.status()).toBe(200);
  });
});
