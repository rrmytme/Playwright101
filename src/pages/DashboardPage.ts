import Wrapper from "../base/Wrapper";

export default class DashboardPage {
  private wrapper: Wrapper;

  private welcomeBanner = ".welcome";
  private ordersTable = "#ordersTable";

  constructor(wrapper: Wrapper) {
    this.wrapper = wrapper;
  }

  async expectWelcomeMessage(name: string) {
    await this.wrapper.expectText(this.welcomeBanner, name);
  }

  async verifyOrderExists(orderName: string) {
    await this.wrapper.expectText(
      `${this.ordersTable} >> text=${orderName}`,
      orderName
    );
  }
}
