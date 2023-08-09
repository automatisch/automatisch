const path = require('node:path');

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async clickAway() {
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('output/screenshots', plainPath);

    return await this.page.screenshot({ path: computedPath, ...restOptions });
  }

  async login() {
    await this.page.goto('/login');
    await this.page
      .getByTestId('email-text-field')
      .fill(process.env.LOGIN_EMAIL);
    await this.page
      .getByTestId('password-text-field')
      .fill(process.env.LOGIN_PASSWORD);

    await this.page.getByTestId('login-button').click();
  }
}
