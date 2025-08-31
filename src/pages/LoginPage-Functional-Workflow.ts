import {
  goto,
  type,
  click,
  expectText,
} from "../base/Wrapper-Functional-Workflow";
import { Page } from "@playwright/test";

// Locators (could also be centralised in a locators.ts)
const usernameInput = "#username";
const passwordInput = "#password";
const loginButton = "#loginBtn";
const errorMessage = ".error-msg";

// Navigates to the login page
export async function gotoLogin(page: Page) {
  await goto(page, "/login");
}

// Performs login action
export async function login(page: Page, username: string, password: string) {
  await type(page, usernameInput, username);
  await type(page, passwordInput, password);
  await click(page, loginButton);
}

// Asserts error message
export async function expectLoginError(page: Page, message: string) {
  await expectText(page, errorMessage, message);
}
