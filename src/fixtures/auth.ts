// fixtures/auth.ts
import { test as base } from '@playwright/test';

type Fixtures = { adminToken: string };

export const test = base.extend<Fixtures>({
  adminToken: [
    async ({ request }, use) => {
      const res = await request.post(`${process.env.API_URL}/auth`, {
        data: { username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS }
      });
      const { token } = await res.json();
      await use(token);
    },
    { scope: 'test' }
  ],
});
export const expect = test.expect;
