// config/global-setup.ts
import { chromium, FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL! + "/login");
  await page.getByLabel("Email").fill(process.env.USER_EMAIL!);
  await page.getByLabel("Password").fill(process.env.USER_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.context().storageState({ path: "config/storage/USER.json" });
  await browser.close();
}
