const path = require('node:path');

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.snackbar = this.page.locator('#notistack-snackbar');
  }

  async clickAway() {
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('output/screenshots', plainPath);

    return await this.page.screenshot({ path: computedPath, ...restOptions });
  }
}
