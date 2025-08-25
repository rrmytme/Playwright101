import { test } from "@playwright/test";
import Wrapper from "../../base/wrapper";
import LoginPage from "../../pages/LoginPage";
import DashboardPage from "../../pages/DashboardPage";

test("Valid login navigates to dashboard", async ({ page }) => {
  const wrapper = new Wrapper(page);
  const loginPage = new LoginPage(wrapper);
  const dashboardPage = new DashboardPage(wrapper);

  await loginPage.goto();
  await loginPage.login("demoUser", "superSecret");
  await dashboardPage.expectWelcomeMessage("demoUser");
});
