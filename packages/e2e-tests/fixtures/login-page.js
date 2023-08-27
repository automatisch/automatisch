const path = require('node:path');
const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');

export class LoginPage extends BasePage {
  path = '/login';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.page = page;
    this.emailTextField = this.page.getByTestId('email-text-field');
    this.passwordTextField = this.page.getByTestId('password-text-field');
    this.loginButton = this.page.getByTestId('login-button');
  }

  async open() {
    return await this.page.goto(this.path);
  }

  async login(
    email = process.env.LOGIN_EMAIL,
    password = process.env.LOGIN_PASSWORD
  ) {
    await this.page.goto(this.path);
    await this.emailTextField.fill(email);
    await this.passwordTextField.fill(password);

    await this.loginButton.click();
  }
}
