import { test } from "src/fixtures/pom";

test("Valid login navigates to dashboard", async ({ login, Dashboard }) => {
  await login.goto();
  await login.login("demoUser", "superSecret");
  await Dashboard.expectWelcomeMessage("demoUser");
});
