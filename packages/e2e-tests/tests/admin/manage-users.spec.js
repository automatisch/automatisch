const { test, expect } = require('../../fixtures/index');

/**
 * NOTE: Make sure to delete all users generated between test runs,
 * otherwise tests will fail since users are only *soft*-deleted
 */
test.describe('User management page', () => {
  test.beforeEach(async ({ adminUsersPage }) => {
    await adminUsersPage.navigateTo();
    await adminUsersPage.closeAllSnackbars();
  });

  test('User creation and deletion process', async ({
    adminCreateUserPage,
    adminEditUserPage,
    adminUsersPage,
  }) => {
    adminCreateUserPage.seed(9000);
    const user = adminCreateUserPage.generateUser();
    await adminUsersPage.usersLoader.waitFor({
      state: 'detached' /* Note: state: 'visible' introduces flakiness
        because visibility: hidden is used as part of the state transition in
        notistack, see
        https://github.com/iamhosseindhv/notistack/blob/122f47057eb7ce5a1abfe923316cf8475303e99a/src/transitions/Collapse/Collapse.tsx#L110
        */,
    });
    await test.step('Create a user', async () => {
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(user.fullName);
      await adminCreateUserPage.emailInput.fill(user.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.invitationEmailInfoAlert.waitFor({
        state: 'attached',
      });
      await adminCreateUserPage.expectCreateUserSuccessAlertToBeVisible();
      await adminUsersPage.navigateTo();
    });
    await test.step('Check the user exists with the expected properties', async () => {
      await adminUsersPage.findUserPageWithEmail(user.email);
      const userRow = await adminUsersPage.getUserRowByEmail(user.email);
      const data = await adminUsersPage.getRowData(userRow);
      await expect(data.email).toBe(user.email);
      await expect(data.fullName).toBe(user.fullName);
      await expect(data.role).toBe('Admin');
    });
    await test.step('Edit user info and make sure the edit works correctly', async () => {
      await adminUsersPage.findUserPageWithEmail(user.email);

      let userRow = await adminUsersPage.getUserRowByEmail(user.email);
      await adminUsersPage.clickEditUser(userRow);
      await adminEditUserPage.waitForLoad(user.fullName);
      const newUserInfo = adminEditUserPage.generateUser();
      await adminEditUserPage.fullNameInput.fill(newUserInfo.fullName);
      await adminEditUserPage.updateButton.click();

      const snackbar = await adminUsersPage.getSnackbarData(
        'snackbar-edit-user-success'
      );
      await expect(snackbar.variant).toBe('success');

      await adminUsersPage.findUserPageWithEmail(user.email);
      userRow = await adminUsersPage.getUserRowByEmail(user.email);
      const rowData = await adminUsersPage.getRowData(userRow);
      await expect(rowData.fullName).toBe(newUserInfo.fullName);
    });
    await test.step('Delete user and check the page confirms this deletion', async () => {
      await adminUsersPage.findUserPageWithEmail(user.email);
      const userRow = await adminUsersPage.getUserRowByEmail(user.email);
      await adminUsersPage.clickDeleteUser(userRow);
      const modal = adminUsersPage.deleteUserModal;
      await modal.deleteButton.click();

      const snackbar = await adminUsersPage.getSnackbarData(
        'snackbar-delete-user-success'
      );
      await expect(snackbar.variant).toBe('success');
    });
  });

  test('Creating a user which has been deleted', async ({
    adminCreateUserPage,
    adminUsersPage,
  }) => {
    adminCreateUserPage.seed(9100);
    const testUser = adminCreateUserPage.generateUser();
    await test.step('Create the test user', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(testUser.fullName);
      await adminCreateUserPage.emailInput.fill(testUser.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.expectCreateUserSuccessAlertToBeVisible();
    });

    await test.step('Delete the created user', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.findUserPageWithEmail(testUser.email);
      const userRow = await adminUsersPage.getUserRowByEmail(testUser.email);
      await adminUsersPage.clickDeleteUser(userRow);
      const modal = adminUsersPage.deleteUserModal;
      await modal.deleteButton.click();
      const snackbar = await adminUsersPage.getSnackbarData(
        'snackbar-delete-user-success'
      );
      await expect(snackbar).not.toBeNull();
      await expect(snackbar.variant).toBe('success');
    });

    await test.step('Create the user again', async () => {
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(testUser.fullName);
      await adminCreateUserPage.emailInput.fill(testUser.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await expect(adminCreateUserPage.fieldError).toHaveCount(1);
    });
  });

  test('Creating a user which already exists', async ({
    adminCreateUserPage,
    adminUsersPage,
    page,
  }) => {
    adminCreateUserPage.seed(9200);
    const testUser = adminCreateUserPage.generateUser();

    await test.step('Create the test user', async () => {
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(testUser.fullName);
      await adminCreateUserPage.emailInput.fill(testUser.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.expectCreateUserSuccessAlertToBeVisible();
    });

    await test.step('Create the user again', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(testUser.fullName);
      await adminCreateUserPage.emailInput.fill(testUser.email);
      const createUserPageUrl = page.url();
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();

      await expect(page.url()).toBe(createUserPageUrl);
      await expect(adminCreateUserPage.fieldError).toHaveCount(1);
    });
  });

  test('Editing a user to have the same email as another user should not be allowed', async ({
    adminCreateUserPage,
    adminEditUserPage,
    adminUsersPage,
    page,
  }) => {
    adminCreateUserPage.seed(9300);
    const user1 = adminCreateUserPage.generateUser();
    const user2 = adminCreateUserPage.generateUser();
    await test.step('Create the first user', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(user1.fullName);
      await adminCreateUserPage.emailInput.fill(user1.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.expectCreateUserSuccessAlertToBeVisible();
    });

    await test.step('Create the second user', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.fullNameInput.fill(user2.fullName);
      await adminCreateUserPage.emailInput.fill(user2.email);
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.expectCreateUserSuccessAlertToBeVisible();
    });

    await test.step('Try editing the second user to have the email of the first user', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.findUserPageWithEmail(user2.email);
      let userRow = await adminUsersPage.getUserRowByEmail(user2.email);
      await adminUsersPage.clickEditUser(userRow);
      await adminEditUserPage.waitForLoad(user2.fullName);
      await adminEditUserPage.emailInput.fill(user1.email);
      const editPageUrl = page.url();
      await adminEditUserPage.updateButton.click();

      await expect(adminEditUserPage.fieldError).toHaveCount(1);
      await expect(page.url()).toBe(editPageUrl);
    });
  });
});
