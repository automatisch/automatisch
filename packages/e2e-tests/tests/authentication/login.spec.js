// @ts-check
const { publicTest, test, expect } = require('../../fixtures/index');

publicTest.describe('Login page', () => {
  publicTest('shows login form', async ({ loginPage }) => {
    await loginPage.emailTextField.waitFor({ state: 'attached' });
    await loginPage.passwordTextField.waitFor({ state: 'attached' });
    await loginPage.loginButton.waitFor({ state: 'attached' });
  });

  publicTest('lets user login', async ({ loginPage }) => {
    await loginPage.login();

    await expect(loginPage.page).toHaveURL('/flows');
  });

  publicTest(`doesn't let un-existing user login`, async ({ loginPage }) => {
    await loginPage.login('nonexisting@automatisch.io', 'sample');

    await expect(loginPage.page).toHaveURL('/login');
  });
});
