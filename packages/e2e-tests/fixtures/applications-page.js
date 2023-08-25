const path = require('node:path');
const { AuthenticatedPage } = require('./authenticated-page');

export class ApplicationsPage extends AuthenticatedPage {
  screenshotPath = '/applications';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.drawerLink = this.page.getByTestId('apps-page-drawer-link');
    this.addConnectionButton = this.page.getByTestId('add-connection-button');
  }
}
