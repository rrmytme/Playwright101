import Wrapper from "../base/Wrapper-Class-Workflow";

export default class LoginPage {
  private wrapper: Wrapper;

  // Locators (could also be centralised in a locators.ts)
  private usernameInput = "#username";
  private passwordInput = "#password";
  private loginButton = "#loginBtn";
  private errorMessage = ".error-msg";

  constructor(wrapper: Wrapper) {
    this.wrapper = wrapper;
  }

  async goto() {
    await this.wrapper.goto("/login");
  }

  async login(username: string, password: string) {
    await this.wrapper.type(this.usernameInput, username);
    await this.wrapper.type(this.passwordInput, password);
    await this.wrapper.click(this.loginButton);
  }

  async expectError(message: string) {
    await this.wrapper.expectText(this.errorMessage, message);
  }
}
