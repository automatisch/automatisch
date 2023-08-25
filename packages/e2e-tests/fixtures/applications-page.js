const path = require('node:path');
const { BasePage } = require('./base-page');

export class ApplicationsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.drawerLink = this.page.getByTestId('apps-page-drawer-link');
    this.addConnectionButton = this.page.getByTestId('add-connection-button');
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('applications', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }
}
