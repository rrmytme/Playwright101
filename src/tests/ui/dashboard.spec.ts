import { test } from "@playwright/test";
import Wrapper from "../../base/wrapper";
import DashboardPage from "../../pages/DashboardPage";

test("Create order via API, verify in UI", async ({ page, request }) => {
  const wrapper = new Wrapper(page);
  wrapper.setApiContext(request);

  // Seed via API
  const order = { item: "Laptop", qty: 1 };
  const res = await wrapper.apiPost("/orders", order);
  await wrapper.expectStatus(res, 201);

  // Verify via UI
  const dashboardPage = new DashboardPage(wrapper);
  await wrapper.goto("/orders");
  await dashboardPage.verifyOrderExists("Laptop");
});
