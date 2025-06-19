const { AuthenticatedPage } = require('../authenticated-page');
const { expect } = require('@playwright/test');

export class AdminApplicationSettingsPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.useOnlyPredefinedAuthClients = page.locator(
      '[name="useOnlyPredefinedAuthClients"]'
    );
    this.disableConnectionsSwitch = page.locator('[name="disabled"]');
    this.saveButton = page.getByTestId('submit-button');
    this.successSnackbar = page.getByTestId(
      'snackbar-save-admin-apps-settings-success'
    );
  }

  async allowUseOnlyPredefinedAuthClients() {
    await expect(this.useOnlyPredefinedAuthClients).not.toBeChecked();
    await this.useOnlyPredefinedAuthClients.check();
  }

  async disallowUseOnlyPredefinedAuthClients() {
    await expect(this.useOnlyPredefinedAuthClients).toBeChecked();
    await this.useOnlyPredefinedAuthClients.uncheck();
    await expect(this.useOnlyPredefinedAuthClients).not.toBeChecked();
  }

  async disallowConnections() {
    await expect(this.disableConnectionsSwitch).not.toBeChecked();
    await this.disableConnectionsSwitch.check();
  }

  async allowConnections() {
    await expect(this.disableConnectionsSwitch).toBeChecked();
    await this.disableConnectionsSwitch.uncheck();
  }

  async saveSettings() {
    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/config') && resp.status() === 200
      ),
      this.saveButton.click(),
    ]);
  }

  async expectOnlyOneSuccessSnackbarToBeVisible() {
    await expect(this.successSnackbar).toBeVisible();
  }

  async expectSuccessSnackbarToBeVisible() {
    const snackbars = await this.successSnackbar.all();
    for (const snackbar of snackbars) {
      await expect(snackbar).toBeVisible();
    }
  }
}
