import Wrapper from "../../base/Wrapper";
import { test } from "src/fixtures/pom";

test("Create order via API, verify in UI", async ({
  page,
  request,
  Dashboard,
}) => {
  const wrapper = new Wrapper(page);
  wrapper.setApiContext(request);

  // Seed via API
  const order = { item: "Laptop", qty: 1 };
  const res = await wrapper.apiPost("/orders", order);
  await wrapper.expectStatus(res, 201);

  // Verify via UI
  await wrapper.goto("/orders");
  await Dashboard.verifyOrderExists("Laptop");
});
