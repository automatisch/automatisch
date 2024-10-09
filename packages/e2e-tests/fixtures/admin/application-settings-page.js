const { AuthenticatedPage } = require('../authenticated-page');
const { expect } = require('@playwright/test');

export class AdminApplicationSettingsPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.allowCustomConnectionsSwitch = this.page.locator(
      '[name="customConnectionAllowed"]'
    );
    this.allowSharedConnectionsSwitch = this.page.locator('[name="shared"]');
    this.disableConnectionsSwitch = this.page.locator('[name="disabled"]');
    this.saveButton = this.page.getByTestId('submit-button');
    this.successSnackbar = this.page.getByTestId(
      'snackbar-save-admin-apps-settings-success'
    );
  }

  async allowCustomConnections() {
    await expect(this.disableConnectionsSwitch).not.toBeChecked();
    await this.allowCustomConnectionsSwitch.check();
    await this.saveButton.click();
  }

  async allowSharedConnections() {
    await expect(this.disableConnectionsSwitch).not.toBeChecked();
    await this.allowSharedConnectionsSwitch.check();
    await this.saveButton.click();
  }

  async disallowConnections() {
    await expect(this.disableConnectionsSwitch).not.toBeChecked();
    await this.disableConnectionsSwitch.check();
    await this.saveButton.click();
  }

  async disallowCustomConnections() {
    await expect(this.disableConnectionsSwitch).toBeChecked();
    await this.allowCustomConnectionsSwitch.uncheck();
    await this.saveButton.click();
  }

  async disallowSharedConnections() {
    await expect(this.disableConnectionsSwitch).toBeChecked();
    await this.allowSharedConnectionsSwitch.uncheck();
    await this.saveButton.click();
  }

  async allowConnections() {
    await expect(this.disableConnectionsSwitch).toBeChecked();
    await this.disableConnectionsSwitch.uncheck();
    await this.saveButton.click();
  }

  async expectSuccessSnackbarToBeVisible() {
    await expect(this.successSnackbar).toHaveCount(1);
    await this.successSnackbar.click();
    await expect(this.successSnackbar).toHaveCount(0);
  }
}
