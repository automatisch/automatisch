const path = require('node:path');
const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');

export class LoginPage extends BasePage {
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

  path = '/login';

  async login() {
    await this.page.goto(this.path);
    await this.emailTextField.fill(process.env.LOGIN_EMAIL);
    await this.passwordTextField.fill(process.env.LOGIN_PASSWORD);

    await this.loginButton.click();

    await expect(this.loginButton).not.toBeVisible();
  }
}
