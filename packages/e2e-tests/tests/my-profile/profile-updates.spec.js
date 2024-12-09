const { publicTest, expect } = require('../../fixtures/index');
const { AdminUsersPage } = require('../../fixtures/admin/users-page');
const { MyProfilePage } = require('../../fixtures/my-profile-page');
const { LoginPage } = require('../../fixtures/login-page');

publicTest.describe('My Profile', () => {
  let testUser;

  publicTest.beforeEach(
    async ({ acceptInvitationPage, adminCreateUserPage, loginPage, page }) => {
      let acceptInvitationLink;

      adminCreateUserPage.seed(
        Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
      );
      testUser = adminCreateUserPage.generateUser();

      const adminUsersPage = new AdminUsersPage(page);
      const myProfilePage = new MyProfilePage(page);

      await publicTest.step('login as Admin', async () => {
        await loginPage.login();
        await expect(loginPage.page).toHaveURL('/flows');
      });

      await publicTest.step('create new user', async () => {
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

      await publicTest.step('copy invitation link', async () => {
        const invitationMessage =
          await adminCreateUserPage.acceptInvitationLink;
        acceptInvitationLink = await invitationMessage.getAttribute('href');
      });

      await publicTest.step('logout', async () => {
        await myProfilePage.logout();
      });

      await publicTest.step('accept invitation', async () => {
        await page.goto(acceptInvitationLink);
        await acceptInvitationPage.acceptInvitation(LoginPage.defaultPassword);
      });

      await publicTest.step('login as new Admin', async () => {
        await loginPage.login(testUser.email, LoginPage.defaultPassword);
        await expect(loginPage.loginButton).not.toBeVisible();
        await expect(page).toHaveURL('/flows');
      });
    }
  );

  publicTest('user should be able to change own data', async ({ page }) => {
    const myProfilePage = new MyProfilePage(page);

    await publicTest.step('change own data', async () => {
      await myProfilePage.navigateTo();

      await myProfilePage.fullName.fill('abecadło');
      await myProfilePage.email.fill('a' + testUser.email);
      await myProfilePage.updateProfileButton.click();
    });

    await publicTest.step('verify changed data', async () => {
      await expect(myProfilePage.fullName).toHaveValue('abecadło');
      await expect(myProfilePage.email).toHaveValue('a' + testUser.email);

      await page.reload();

      await expect(myProfilePage.fullName).toHaveValue('abecadło');
      await expect(myProfilePage.email).toHaveValue('a' + testUser.email);
    });
  });

  publicTest(
    'user should not be able to change email to already existing one',
    async ({ page }) => {
      const myProfilePage = new MyProfilePage(page);

      await publicTest.step('change email to existing one', async () => {
        await myProfilePage.navigateTo();

        await myProfilePage.email.fill(LoginPage.defaultEmail);
        await myProfilePage.updateProfileButton.click();
      });

      await publicTest.step('verify error message', async () => {
        const snackbar = await myProfilePage.getSnackbarData(
          'snackbar-update-profile-settings-error'
        );
        await expect(snackbar.variant).toBe('error');
      });
    }
  );

  publicTest(
    'user should be able to change own password',
    async ({ loginPage, page }) => {
      const myProfilePage = new MyProfilePage(page);

      await publicTest.step('change own password', async () => {
        await myProfilePage.navigateTo();

        await myProfilePage.currentPassword.fill(LoginPage.defaultPassword);
        await myProfilePage.newPassword.fill(
          LoginPage.defaultPassword + LoginPage.defaultPassword
        );
        await myProfilePage.passwordConfirmation.fill(
          LoginPage.defaultPassword + LoginPage.defaultPassword
        );
        await myProfilePage.updatePasswordButton.click();
      });

      await publicTest.step('logout', async () => {
        await myProfilePage.logout();
      });

      await publicTest.step('login with new credentials', async () => {
        await loginPage.login(
          testUser.email,
          LoginPage.defaultPassword + LoginPage.defaultPassword
        );
        await expect(loginPage.loginButton).not.toBeVisible();
        await expect(page).toHaveURL('/flows');
      });

      await publicTest.step('verify if user is the same', async () => {
        await myProfilePage.navigateTo();
        await expect(myProfilePage.email).toHaveValue(testUser.email);
      });
    }
  );

  publicTest(
    'user should not be able to change own password if current one is incorrect',
    async ({ loginPage, page }) => {
      const myProfilePage = new MyProfilePage(page);

      await publicTest.step('change own password', async () => {
        await myProfilePage.navigateTo();

        await myProfilePage.currentPassword.fill('wrongpassword');
        await myProfilePage.newPassword.fill(
          LoginPage.defaultPassword + LoginPage.defaultPassword
        );
        await myProfilePage.passwordConfirmation.fill(
          LoginPage.defaultPassword + LoginPage.defaultPassword
        );
        await myProfilePage.updatePasswordButton.click();
      });

      await publicTest.step('verify error message', async () => {
        const snackbar = await myProfilePage.getSnackbarData(
          'snackbar-update-password-error'
        );
        await expect(snackbar.variant).toBe('error');
      });

      await publicTest.step('logout', async () => {
        await myProfilePage.logout();
      });

      await publicTest.step('login with old credentials', async () => {
        await loginPage.login(testUser.email, LoginPage.defaultPassword);
        await expect(loginPage.loginButton).not.toBeVisible();
        await expect(page).toHaveURL('/flows');
      });

      await publicTest.step('verify if user is the same', async () => {
        await myProfilePage.navigateTo();
        await expect(myProfilePage.email).toHaveValue(testUser.email);
      });
    }
  );
});
