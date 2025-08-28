// tests/admin/users.spec.ts
import { test, expect } from "../../fixtures/auth";

test("@api admin can list users", async ({ api, adminToken }) => {
  const res = await api.get("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  expect(res.ok()).toBeTruthy();
  const users = await res.json();
  expect(Array.isArray(users)).toBe(true);
});

test("@api admin can create a user", async ({ api, adminToken }) => {
  const newUser = {
    username: "newuser",
    password: "password123",
    role: "user",
  };
  const res = await api.post("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: newUser,
  });
  expect(res.status()).toBe(201);
  const createdUser = await res.json();
  expect(createdUser.username).toBe(newUser.username);
});

test("@api admin cannot create user with existing username", async ({
  api,
  adminToken,
}) => {
  const existingUser = {
    username: "existinguser",
    password: "password123",
    role: "user",
  };
  // First, create the user
  await api.post("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: existingUser,
  });
  // Try to create again
  const res = await api.post("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: existingUser,
  });
  expect(res.status()).toBe(400);
  const error = await res.json();
  expect(error.message).toBe("Username already exists");
});

test("@api non-admin cannot list users", async ({ api, userToken }) => {
  const res = await api.get("/api/users", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  expect(res.status()).toBe(403);
});
