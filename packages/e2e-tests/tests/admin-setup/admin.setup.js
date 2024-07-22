const { publicTest: setup, expect } = require('../../fixtures/index');

setup.describe.serial('Admin setup page', () => {
  // eslint-disable-next-line no-unused-vars
  setup('should not be able to login if admin is not created', async ({ page, adminSetupPage, loginPage }) => {
    await expect(async () => {
      await expect(await page.url()).toContain(adminSetupPage.path);
    }).toPass();
  });

  setup('should validate the inputs', async ({ adminSetupPage }) => {
    await adminSetupPage.open();
    await adminSetupPage.fillInvalidUserData();
    await adminSetupPage.submitAdminForm();
    await adminSetupPage.expectInvalidFields(4);

    await adminSetupPage.fillNotMatchingPasswordUserData();
    await adminSetupPage.submitAdminForm();
    await adminSetupPage.expectInvalidFields(1);
  });

  setup('should create admin', async ({ adminSetupPage }) => {
    await adminSetupPage.open();
    await adminSetupPage.fillValidUserData();
    await adminSetupPage.submitAdminForm();
    await adminSetupPage.expectSuccessAlertToBeVisible();
    await adminSetupPage.expectSuccessMessageToContainLoginLink();
  });
});
