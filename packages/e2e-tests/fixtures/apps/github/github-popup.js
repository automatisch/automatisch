const { BasePage } = require('../../base-page');

export class GithubPopup extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  static async handle (page) {
    const popup = new GithubPopup(page);
    return await popup.handleAuthFlow();
  }

  getPathname () {
    const url = this.page.url()
    try {
      return new URL(url).pathname;
    } catch (e) {
      return new URL(`https://github.com/${url}`).pathname;
    }
  }

  async handleAuthFlow () {
    if (this.getPathname() === '/login') {
      await this.handleLogin();
    }
    if (this.page.isClosed()) { return; }
    if (this.getPathname() === '/login/oauth/authorize') {
      await this.handleAuthorize();
    }
  }

  async handleLogin () {
    const loginInput = this.page.getByLabel('Username or email address');
    loginInput.click();
    await loginInput.fill(process.env.GITHUB_USERNAME);
    const passwordInput = this.page.getByLabel('Password');
    passwordInput.click()
    await passwordInput.fill(process.env.GITHUB_PASSWORD);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    // await this.page.waitForTimeout(2000);
    if (this.page.isClosed()) {
      return
    }
    // await this.page.waitForLoadState('networkidle', 30000);
    this.page.waitForEvent('load');
    if (this.page.isClosed()) {
      return
    }
    await this.page.waitForURL(function (url) {
      const u = new URL(url);
      return (
        u.pathname === '/login/oauth/authorize'
      ) && u.searchParams.get('client_id');
    });
  }

  async handleAuthorize () {
    if (this.page.isClosed()) { return }
    const authorizeButton = this.page.getByRole(
      'button',
      { name: 'Authorize' }
    );
    await this.page.waitForEvent('load');
    await authorizeButton.click();
    await this.page.waitForURL(function (url) {
      const u = new URL(url);
      return (
        u.pathname === '/login/oauth/authorize'
      ) && (
        u.searchParams.get('client_id') === null
      );
    })
    const passwordInput = this.page.getByLabel('Password');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(process.env.GITHUB_PASSWORD);
      const submitButton = this.page
        .getByRole('button')
        .filter({ hasText: /confirm|submit|enter|go|sign in/gmi });
      if (await submitButton.isVisible()) {
        submitButton.waitFor();
        await expect(submitButton).toBeEnabled();
        await submitButton.click();
      } else {
        throw {
          page: this.page,
          error: 'Could not find submit button for confirming user account'
        };
      }
    }
    await this.page.waitForEvent('close')
  }
}