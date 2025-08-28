import { test, expect } from "@playwright/test";

test("C# API health check", async ({ request }) => {
  const res = await request.get(`${process.env.API_URL}/health`);
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe("Connected");
});
