import { expectText } from "../base/Wrapper-Functional-Workflow";
import { Page } from "@playwright/test";

// Locators
const welcomeBanner = ".welcome";
const ordersTable = "#ordersTable";

// Asserts welcome message
export async function expectWelcomeMessage(page: Page, name: string) {
  await expectText(page, welcomeBanner, name);
}

// Verifies order exists in table
export async function verifyOrderExists(page: Page, orderName: string) {
  await expectText(page, `${ordersTable} >> text=${orderName}`, orderName);
}
