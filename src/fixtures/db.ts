// fixtures/db.ts
import { test as base } from '@playwright/test';
import mysql from 'mysql2/promise';

type Fixtures = { seedId: number };

export const test = base.extend<Fixtures>({
  seedId: async ({}, use) => {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASS, database: process.env.DB_NAME
    });
    const [rows]: any = await conn.query('CALL seed_test_data()');
    const id = rows?.insertId ?? Date.now();
    await use(id); // tests run here
    await conn.query('CALL cleanup_test_data(?)', [id]); // teardown
    await conn.end();
  },
});
export const expect = test.expect;
