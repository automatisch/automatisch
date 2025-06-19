const { AuthenticatedPage } = require('../authenticated-page');

export class AdminApplicationsPage extends AuthenticatedPage {
  screenshotPath = '/admin-settings/apps';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.searchInput = page.locator('[id="search-input"]');
    this.appRow = page.getByTestId('app-row');
    this.appsDrawerLink = page.getByTestId('apps-drawer-link');
    this.appsLoader = page.getByTestId('apps-loader');
  }

  async openApplication(appName) {
    await this.searchInput.fill(appName);
    await this.appRow.locator(this.page.getByText(appName)).click();
  }

  async navigateTo() {
    await this.profileMenuButton.click();
    await this.adminMenuItem.click();
    await this.appsDrawerLink.click();
    await this.isMounted();
    await this.appsLoader.waitFor({
      state: 'detached',
    });
  }
}
