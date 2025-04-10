const { test, expect } = require('../../fixtures/index');

test('Check Own permissions when All are checked', async ({
  adminRolesPage,
  adminCreateRolePage,
}) => {
  await adminRolesPage.navigateTo();
  await adminRolesPage.createRoleButton.click();
  await adminCreateRolePage.waitForPermissionsCatalogToVisible();

  await adminCreateRolePage.connectionPermissionRow
    .locator(adminCreateRolePage.readCheckbox)
    .check();
  await expect(
    adminCreateRolePage.connectionPermissionRow.locator(
      adminCreateRolePage.isCreatorReadCheckbox
    )
  ).toBeChecked();

  await adminCreateRolePage.flowPermissionRow
    .locator(adminCreateRolePage.readCheckbox)
    .check();
  await expect(
    adminCreateRolePage.flowPermissionRow.locator(
      adminCreateRolePage.isCreatorReadCheckbox
    )
  ).toBeChecked();

  await adminCreateRolePage.executionPermissionRow
    .locator(adminCreateRolePage.readCheckbox)
    .check();
  await expect(
    adminCreateRolePage.executionPermissionRow.locator(
      adminCreateRolePage.isCreatorReadCheckbox
    )
  ).toBeChecked();

  await adminCreateRolePage.connectionPermissionRow
    .locator(adminCreateRolePage.manageCheckbox)
    .check();
  await expect(
    adminCreateRolePage.connectionPermissionRow.locator(
      adminCreateRolePage.isCreatorManageCheckbox
    )
  ).toBeChecked();

  await adminCreateRolePage.flowPermissionRow
    .locator(adminCreateRolePage.manageCheckbox)
    .check();
  await expect(
    adminCreateRolePage.flowPermissionRow.locator(
      adminCreateRolePage.isCreatorManageCheckbox
    )
  ).toBeChecked();
});
