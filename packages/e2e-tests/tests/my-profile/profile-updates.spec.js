const { publicTest, expect } = require('../../fixtures/index');
const { AdminUsersPage } = require('../../fixtures/admin/users-page');
const { MyProfilePage } = require('../../fixtures/my-profile-page');

publicTest.describe('My Profile', () => {
  publicTest(
    'user should be able to change own data',
    async ({ acceptInvitationPage, adminCreateUserPage, loginPage, page }) => {
      let acceptInvitationLink;

      adminCreateUserPage.seed(
        Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
      );
      const testUser = adminCreateUserPage.generateUser();

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
        const snackbar = await adminUsersPage.getSnackbarData(
          'snackbar-create-user-success'
        );
        await expect(snackbar.variant).toBe('success');
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
        await acceptInvitationPage.acceptInvitation(process.env.LOGIN_PASSWORD);
      });

      await publicTest.step('login as new Admin', async () => {
        await loginPage.login(testUser.email, process.env.LOGIN_PASSWORD);
        await expect(loginPage.loginButton).not.toBeVisible();
        await expect(page).toHaveURL('/flows');
      });

      await publicTest.step('change own data', async () => {
        await myProfilePage.navigateTo();

        await myProfilePage.fullName.fill('abecadło');
        await myProfilePage.email.fill('a' + testUser.email);
        await myProfilePage.newPassword.fill(
          process.env.LOGIN_PASSWORD + process.env.LOGIN_PASSWORD
        );
        await myProfilePage.passwordConfirmation.fill(
          process.env.LOGIN_PASSWORD + process.env.LOGIN_PASSWORD
        );
        await myProfilePage.updateProfileButton.click();
      });

      await publicTest.step('logout', async () => {
        await myProfilePage.logout();
      });

      await publicTest.step('login with new credentials', async () => {
        await loginPage.login(
          'a' + testUser.email,
          process.env.LOGIN_PASSWORD + process.env.LOGIN_PASSWORD
        );
        await expect(loginPage.loginButton).not.toBeVisible();
        await expect(page).toHaveURL('/flows');
      });

      await publicTest.step('verify changed data', async () => {
        await myProfilePage.navigateTo();
        await expect(myProfilePage.fullName).toHaveValue('abecadło');
        await expect(myProfilePage.email).toHaveValue('a' + testUser.email);
      });
    }
  );
});
