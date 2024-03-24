const { test, expect } = require('../../fixtures/index');
const { LoginPage } = require('../../fixtures/login-page');

test.describe('Role management page', () => {
  test('Admin role is not deletable', async ({ adminRolesPage }) => {
    await adminRolesPage.navigateTo();
    const adminRow = await adminRolesPage.getRoleRowByName('Admin');
    await expect(adminRow).toHaveCount(1);
    const data = await adminRolesPage.getRowData(adminRow);
    await expect(data.role).toBe('Admin');
    await expect(data.canEdit).toBe(true);
    await expect(data.canDelete).toBe(false);
  });

  test('Can create, edit, and delete a role', async ({
    adminCreateRolePage,
    adminEditRolePage,
    adminRolesPage,
    page,
  }) => {
    await test.step('Create a new role', async () => {
      await adminRolesPage.navigateTo();
      await adminRolesPage.createRoleButton.click();
      await adminCreateRolePage.isMounted();
      await adminCreateRolePage.nameInput.fill('Create Edit Test');
      await adminCreateRolePage.descriptionInput.fill('Test description');
      await adminCreateRolePage.createButton.click();
      await adminCreateRolePage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminCreateRolePage.getSnackbarData(
        'snackbar-create-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminCreateRolePage.closeSnackbar();
    });

    let roleRow = await test.step(
      'Make sure role data is correct',
      async () => {
        const roleRow = await adminRolesPage.getRoleRowByName(
          'Create Edit Test'
        );
        await expect(roleRow).toHaveCount(1);
        const roleData = await adminRolesPage.getRowData(roleRow);
        await expect(roleData.role).toBe('Create Edit Test');
        await expect(roleData.description).toBe('Test description');
        await expect(roleData.canEdit).toBe(true);
        await expect(roleData.canDelete).toBe(true);
        return roleRow;
      }
    );

    await test.step('Edit the role', async () => {
      await adminRolesPage.clickEditRole(roleRow);
      await adminEditRolePage.isMounted();
      await adminEditRolePage.nameInput.fill('Create Update Test');
      await adminEditRolePage.descriptionInput.fill('Update test description');
      await adminEditRolePage.updateButton.click();
      await adminEditRolePage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminEditRolePage.getSnackbarData(
        'snackbar-edit-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminEditRolePage.closeSnackbar();
    });

    roleRow = await test.step(
      'Make sure changes reflected on roles page',
      async () => {
        await adminRolesPage.isMounted();
        const roleRow = await adminRolesPage.getRoleRowByName(
          'Create Update Test'
        );
        await expect(roleRow).toHaveCount(1);
        const roleData = await adminRolesPage.getRowData(roleRow);
        await expect(roleData.role).toBe('Create Update Test');
        await expect(roleData.description).toBe('Update test description');
        await expect(roleData.canEdit).toBe(true);
        await expect(roleData.canDelete).toBe(true);
        return roleRow;
      }
    );

    await test.step('Delete the role', async () => {
      await adminRolesPage.clickDeleteRole(roleRow);
      const deleteModal = adminRolesPage.deleteRoleModal;
      await deleteModal.modal.waitFor({
        state: 'attached',
      });
      await deleteModal.deleteButton.click();
      await adminRolesPage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminRolesPage.getSnackbarData(
        'snackbar-delete-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminRolesPage.closeSnackbar();
      await deleteModal.modal.waitFor({
        state: 'detached',
      });
      await expect(roleRow).toHaveCount(0);
    });
  });

  // This test breaks right now
  test.skip('Make sure create/edit role page is scrollable', async ({
    adminRolesPage,
    adminEditRolePage,
    adminCreateRolePage,
    page,
  }) => {
    const initViewportSize = page.viewportSize;
    await page.setViewportSize({
      width: 800,
      height: 400,
    });

    await test.step('Ensure create role page is scrollable', async () => {
      await adminRolesPage.navigateTo(true);
      await adminRolesPage.createRoleButton.click();
      await adminCreateRolePage.isMounted();

      const initScrollTop = await page.evaluate(() => {
        return document.documentElement.scrollTop;
      });
      await page.mouse.move(400, 100);
      await page.mouse.click(400, 100);
      await page.mouse.wheel(200, 0);
      const updatedScrollTop = await page.evaluate(() => {
        return document.documentElement.scrollTop;
      });
      await expect(initScrollTop).not.toBe(updatedScrollTop);
    });

    await test.step('Ensure edit role page is scrollable', async () => {
      await adminRolesPage.navigateTo(true);
      const adminRow = await adminRolesPage.getRoleRowByName('Admin');
      await adminRolesPage.clickEditRole(adminRow);
      await adminEditRolePage.isMounted();

      const initScrollTop = await page.evaluate(() => {
        return document.documentElement.scrollTop;
      });
      await page.mouse.move(400, 100);
      await page.mouse.wheel(200, 0);
      const updatedScrollTop = await page.evaluate(() => {
        return document.documentElement.scrollTop;
      });
      await expect(initScrollTop).not.toBe(updatedScrollTop);
    });

    await test.step('Reset viewport', async () => {
      await page.setViewportSize(initViewportSize);
    });
  });

  test('Cannot delete a role with a user attached to it', async ({
    adminCreateRolePage,
    adminRolesPage,
    adminUsersPage,
    adminCreateUserPage,
    adminEditUserPage,
    page,
  }) => {
    test.slow();
    await adminRolesPage.navigateTo();
    await test.step('Create a new role', async () => {
      await adminRolesPage.createRoleButton.click();
      await adminCreateRolePage.isMounted();
      await adminCreateRolePage.nameInput.fill('Delete Role');
      await adminCreateRolePage.createButton.click();
      await adminCreateRolePage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminCreateRolePage.getSnackbarData(
        'snackbar-create-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminCreateRolePage.closeSnackbar();
    });
    await test.step(
      'Create a new user with the "Delete Role" role',
      async () => {
        await adminUsersPage.navigateTo();
        await adminUsersPage.createUserButton.click();
        await adminCreateUserPage.fullNameInput.fill('User Role Test');
        await adminCreateUserPage.emailInput.fill(
          'user-role-test@automatisch.io'
        );
        await adminCreateUserPage.passwordInput.fill('sample');
        await adminCreateUserPage.roleInput.click();
        await adminCreateUserPage.page
          .getByRole('option', { name: 'Delete Role', exact: true })
          .click();
        await adminCreateUserPage.createButton.click();
        await adminUsersPage.snackbar.waitFor({
          state: 'attached',
        });
        const snackbar = await adminUsersPage.getSnackbarData(
          'snackbar-create-user-success'
        );
        await expect(snackbar.variant).toBe('success');
        await adminUsersPage.closeSnackbar();
      }
    );
    await test.step(
      'Try to delete "Delete Role" role when new user has it',
      async () => {
        await adminRolesPage.navigateTo();
        const row = await adminRolesPage.getRoleRowByName('Delete Role');
        const modal = await adminRolesPage.clickDeleteRole(row);
        await modal.deleteButton.click();
        await adminRolesPage.snackbar.waitFor({
          state: 'attached',
        });
        const snackbar = await adminRolesPage.getSnackbarData('snackbar-error');
        await expect(snackbar.variant).toBe('error');
        await adminRolesPage.closeSnackbar();
        await modal.close();
      }
    );
    await test.step('Change the role the user has', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.usersLoader.waitFor({
        state: 'detached',
      });
      const row = await adminUsersPage.findUserPageWithEmail(
        'user-role-test@automatisch.io'
      );
      await adminUsersPage.clickEditUser(row);
      await adminEditUserPage.roleInput.click();
      await adminEditUserPage.page
        .getByRole('option', { name: 'Admin' })
        .click();
      await adminEditUserPage.updateButton.click();
      await adminEditUserPage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminEditUserPage.getSnackbarData(
        'snackbar-edit-user-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminEditUserPage.closeSnackbar();
    });
    await test.step('Delete the original role', async () => {
      await adminRolesPage.navigateTo();
      const row = await adminRolesPage.getRoleRowByName('Delete Role');
      const modal = await adminRolesPage.clickDeleteRole(row);
      await expect(modal.modal).toBeVisible();
      await modal.deleteButton.click();
      await adminRolesPage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminRolesPage.getSnackbarData(
        'snackbar-delete-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminRolesPage.closeSnackbar();
    });
  });

  test('Deleting a role after deleting a user with that role', async ({
    adminCreateRolePage,
    adminRolesPage,
    adminUsersPage,
    adminCreateUserPage,
    page,
  }) => {
    await adminRolesPage.navigateTo();
    await test.step('Create a new role', async () => {
      await adminRolesPage.createRoleButton.click();
      await adminCreateRolePage.isMounted();
      await adminCreateRolePage.nameInput.fill('Cannot Delete Role');
      await adminCreateRolePage.createButton.click();
      await adminCreateRolePage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminCreateRolePage.getSnackbarData(
        'snackbar-create-role-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminCreateRolePage.closeSnackbar();
    });
    await test.step('Create a new user with this role', async () => {
      await adminUsersPage.navigateTo();
      await adminUsersPage.createUserButton.click();
      await adminCreateUserPage.isMounted();
      await adminCreateUserPage.fullNameInput.fill('User Delete Role Test');
      await adminCreateUserPage.emailInput.fill(
        'user-delete-role-test@automatisch.io'
      );
      await adminCreateUserPage.passwordInput.fill('sample');
      await adminCreateUserPage.roleInput.click();
      await adminCreateUserPage.page
        .getByRole('option', { name: 'Cannot Delete Role' })
        .click();
      await adminCreateUserPage.createButton.click();
      await adminCreateUserPage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminCreateUserPage.getSnackbarData(
        'snackbar-create-user-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminCreateUserPage.closeSnackbar();
    });
    await test.step('Delete this user', async () => {
      await adminUsersPage.navigateTo();
      const row = await adminUsersPage.findUserPageWithEmail(
        'user-delete-role-test@automatisch.io'
      );
      // await test.waitForTimeout(10000);
      const modal = await adminUsersPage.clickDeleteUser(row);
      await modal.deleteButton.click();
      await adminUsersPage.snackbar.waitFor({
        state: 'attached',
      });
      const snackbar = await adminUsersPage.getSnackbarData(
        'snackbar-delete-user-success'
      );
      await expect(snackbar.variant).toBe('success');
      await adminUsersPage.closeSnackbar();
    });
    await test.step('Try deleting this role', async () => {
      await adminRolesPage.navigateTo();
      const row = await adminRolesPage.getRoleRowByName('Cannot Delete Role');
      const modal = await adminRolesPage.clickDeleteRole(row);
      await modal.deleteButton.click();
      await adminRolesPage.snackbar.waitFor({
        state: 'attached',
      });
      /*
        * TODO: await snackbar - make assertions based on product 
        * decisions
        const snackbar = await adminRolesPage.getSnackbarData();
        await expect(snackbar.variant).toBe('...');
        */
      await adminRolesPage.closeSnackbar();
    });
  });
});

test('Accessibility of role management page', async ({
  page,
  adminUsersPage,
  adminCreateUserPage,
  adminEditUserPage,
  adminRolesPage,
  adminCreateRolePage,
}) => {
  test.slow();
  await test.step('Create the basic test role', async () => {
    await adminRolesPage.navigateTo();
    await adminRolesPage.createRoleButton.click();
    await adminCreateRolePage.isMounted();
    await adminCreateRolePage.nameInput.fill('Basic Test');
    await adminCreateRolePage.createButton.click();
    await adminCreateRolePage.snackbar.waitFor({
      state: 'attached',
    });
    const snackbar = await adminCreateRolePage.getSnackbarData(
      'snackbar-create-role-success'
    );
    await expect(snackbar.variant).toBe('success');
    await adminCreateRolePage.closeSnackbar();
  });

  await test.step('Create a new user with the basic role', async () => {
    await adminUsersPage.navigateTo();
    await adminUsersPage.createUserButton.click();
    await adminCreateUserPage.isMounted();
    await adminCreateUserPage.fullNameInput.fill('Role Test');
    await adminCreateUserPage.emailInput.fill('basic-role-test@automatisch.io');
    await adminCreateUserPage.passwordInput.fill('sample');
    await adminCreateUserPage.roleInput.click();
    await adminCreateUserPage.page
      .getByRole('option', { name: 'Basic Test' })
      .click();
    await adminCreateUserPage.createButton.click();
    await adminCreateUserPage.snackbar.waitFor({
      state: 'attached',
    });
    const snackbar = await adminCreateUserPage.getSnackbarData(
      'snackbar-create-user-success'
    );
    await expect(snackbar.variant).toBe('success');
    await adminCreateUserPage.closeSnackbar();
  });

  await test.step('Logout and login to the basic role user', async () => {
    await page.getByTestId('profile-menu-button').click();
    await page.getByTestId('logout-item').click();
    // await page.reload({ waitUntil: 'networkidle' });
    const loginPage = new LoginPage(page);
    // await loginPage.isMounted();
    await loginPage.login('basic-role-test@automatisch.io', 'sample');
    await expect(loginPage.loginButton).not.toBeVisible();
    await expect(page).toHaveURL('/flows');
  });

  await test.step(
    'Navigate to the admin settings page and make sure it is blank',
    async () => {
      const pageUrl = new URL(page.url());
      const url = `${pageUrl.origin}/admin-settings/users`;
      await page.goto(url);
      await page.waitForTimeout(750);
      const isUnmounted = await page.evaluate(() => {
        const root = document.querySelector('#root');
        if (root) {
          return root.children.length === 0;
        }
        return false;
      });
      await expect(isUnmounted).toBe(true);
    }
  );

  await test.step('Log back into the admin account', async () => {
    await page.goto('/');
    await page.getByTestId('profile-menu-button').click();
    await page.getByTestId('logout-item').click();
    const loginPage = new LoginPage(page);
    await loginPage.isMounted();
    await loginPage.login();
  });

  await test.step('Move the user off the role', async () => {
    await adminUsersPage.navigateTo();
    const row = await adminUsersPage.findUserPageWithEmail(
      'basic-role-test@automatisch.io'
    );
    await adminUsersPage.clickEditUser(row);
    await adminEditUserPage.isMounted();
    await adminEditUserPage.roleInput.click();
    await adminEditUserPage.page.getByRole('option', { name: 'Admin' }).click();
    await adminEditUserPage.updateButton.click();
    await adminEditUserPage.snackbar.waitFor({
      state: 'attached',
    });
    await adminEditUserPage.closeSnackbar();
  });

  await test.step('Delete the role', async () => {
    await adminRolesPage.navigateTo();
    const roleRow = await adminRolesPage.getRoleRowByName('Basic Test');
    await adminRolesPage.clickDeleteRole(roleRow);
    const deleteModal = adminRolesPage.deleteRoleModal;
    await deleteModal.modal.waitFor({
      state: 'attached',
    });
    await deleteModal.deleteButton.click();
    await adminRolesPage.snackbar.waitFor({
      state: 'attached',
    });
    const snackbar = await adminRolesPage.getSnackbarData(
      'snackbar-delete-role-success'
    );
    await expect(snackbar.variant).toBe('success');
    await adminRolesPage.closeSnackbar();
    await deleteModal.modal.waitFor({
      state: 'detached',
    });
    await expect(roleRow).toHaveCount(0);
  });
});
