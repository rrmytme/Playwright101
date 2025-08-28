// fixtures/auth.ts
import { APIRequestContext, test as base } from "@playwright/test";

type Fixtures = {
  adminToken: string; // Admin user token fixture
  userToken: string; // Regular user token fixture
  api: APIRequestContext; // API request context fixture
};

export const test = base.extend<Fixtures>({
  // Provide an APIRequestContext instance as a fixture
  api: async ({ request }, use) => {
    await use(request);
  },
  // Provide an admin token as a fixture
  adminToken: [
    async ({ api }, use) => {
      const res = await api.post(`${process.env.API_URL}/auth`, {
        data: {
          username: process.env.ADMIN_USER,
          password: process.env.ADMIN_PASS,
        },
      });
      const { token } = await res.json();
      await use(token);
    },
    { scope: "test" },
  ],
  // Provide a regular user token as a fixture
  userToken: [
    async ({ api }, use) => {
      const res = await api.post(`${process.env.API_URL}/auth`, {
        data: {
          username: process.env.USER_NAME,
          password: process.env.USER_PASS,
        },
      });
      const { token } = await res.json();
      await use(token);
    },
    { scope: "test" },
  ],
});
export const expect = test.expect;
