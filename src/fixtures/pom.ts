// fixtures/pom.ts

import { test as base } from "@playwright/test"; // Import Playwright's base test
import Wrapper from "src/base/Wrapper"; // Custom wrapper for Playwright's page object
import LoginPage from "../pages/LoginPage"; // Page object for the login page
import DashboardPage from "src/pages/DashboardPage"; // Page object for the dashboard page

// Define the types for the fixtures to be injected into tests
type Fixtures = {
  login: LoginPage; // Login page fixture
  Dashboard: DashboardPage; // Dashboard page fixture
};

// Extend Playwright's test with custom fixtures
export const test = base.extend<Fixtures>({
  // Provide a LoginPage instance as a fixture
  login: async ({ page }, use) => {
    await use(new LoginPage(new Wrapper(page)));
  },
  // Provide a DashboardPage instance as a fixture
  Dashboard: async ({ page }, use) => {
    await use(new DashboardPage(new Wrapper(page)));
  },
});

// Export Playwright's expect for assertions in tests
export const expect = test.expect;
