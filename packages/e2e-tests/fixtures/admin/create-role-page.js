import { expect } from '@playwright/test';

const { AuthenticatedPage } = require('../authenticated-page');
const { RoleConditionsModal } = require('./role-conditions-modal');

export class AdminCreateRolePage extends AuthenticatedPage {
  screenshotPath = '/admin/create-role';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.nameInput = page.getByTestId('name-input');
    this.descriptionInput = page.getByTestId('description-input');
    this.createButton = page.getByTestId('create-button');
    this.pageTitle = page.getByTestId('create-role-title');
    this.permissionsCatalog = page.getByTestId('permissions-catalog');

    this.connectionPermissionRow = page.getByTestId(
      'Connection-permission-row'
    );
    this.flowPermissionRow = page.getByTestId('Flow-permission-row');
    this.executionPermissionRow = page.getByTestId('Execution-permission-row');
    this.isCreatorReadCheckbox = page
      .getByTestId('isCreator-read-checkbox')
      .locator('input');
    this.readCheckbox = page.getByTestId('read-checkbox').locator('input');
    this.isCreatorManageCheckbox = page
      .getByTestId('isCreator-manage-checkbox')
      .locator('input');
    this.manageCheckbox = page.getByTestId('manage-checkbox').locator('input');
  }

  async waitForPermissionsCatalogToVisible() {
    await expect(this.permissionsCatalog).toBeVisible();
  }
}
