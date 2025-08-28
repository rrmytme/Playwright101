// global-setup.ts
import { chromium, FullConfig } from "@playwright/test";
import mysql from "mysql2/promise";

export default async function globalSetup(config: FullConfig) {
  // 1) Seed MySQL
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  await conn.query("CALL seed_test_data()");
  await conn.end();

  // 2) Auth Bootstrap
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL}/login`);
  await page.fill("#email", process.env.USER_EMAIL!);
  await page.fill("#password", process.env.USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.context().storageState({ path: "config/storage/auth.json" });
  await browser.close();
}
