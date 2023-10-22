const { test, expect } = require('../../fixtures/index');

test(
  'Role permissions conform with role conditions ',
  async({ adminRolesPage, adminCreateRolePage }) => {
    await adminRolesPage.navigateTo();
    await adminRolesPage.createRoleButton.click();
    
    /*
    example config: {
      action: 'read',
      subject: 'connection',
      row: page.getByTestId('connection-permission-row'),
      locator: row.getByTestId('read-checkbox')
    }
    */
    const permissionConfigs = 
      await adminCreateRolePage.getPermissionConfigs();

    await test.step(
      'Iterate over each permission config and make sure role conditions conform',
      async () => {
        for (let config of permissionConfigs) {
          await config.locator.click();
          await adminCreateRolePage.clickPermissionSettings(config.row);
          const modal = adminCreateRolePage.getRoleConditionsModal(
            config.subject
          );
          await expect(modal.modal).toBeVisible();
          const conditions = await modal.getAvailableConditions();
          for (let conditionAction of Object.keys(conditions)) {
            if (conditionAction === config.action) {
              await expect(conditions[conditionAction]).not.toBeDisabled();
            } else {
              await expect(conditions[conditionAction]).toBeDisabled();
            }
          }
          await modal.close();
          await config.locator.click();
        }
      }
    );
  }
);

test(
  'Default role permissions conforms with role conditions',
  async({ adminRolesPage, adminCreateRolePage }) => {
    await adminRolesPage.navigateTo();
    await adminRolesPage.createRoleButton.click();

    const subjects = ['Connection', 'Execution', 'Flow'];
    for (let subject of subjects) {
      const row = adminCreateRolePage.getSubjectRow(subject)
      const modal = adminCreateRolePage.getRoleConditionsModal(subject);
      await adminCreateRolePage.clickPermissionSettings(row);
      await expect(modal.modal).toBeVisible();
      const availableConditions = await modal.getAvailableConditions();
      const conditions = ['create', 'read', 'update', 'delete', 'publish'];
      for (let condition of conditions) {
        if (availableConditions[condition]) {
          await expect(availableConditions[condition]).toBeDisabled();
        }
      }
      await modal.close();
    }

  }
);