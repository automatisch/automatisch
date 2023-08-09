const { test, expect } = require('../../fixtures/index');

test.describe('Apps page', () => {
  test.beforeEach(async ({ page, applicationsPage }) => {
    await applicationsPage.login();
    await page.getByTestId('apps-page-drawer-link').click();
  });

  test('displays applications', async ({ page, applicationsPage }) => {
    await page.getByTestId('apps-loader').waitFor({
      state: 'detached',
    });
    await expect(page.getByTestId('app-row')).not.toHaveCount(0);

    await applicationsPage.screenshot({
      path: 'Applications.png',
    });
  });

  test.describe('can add connection', () => {
    test.beforeEach(async ({ page }) => {
      await expect(page.getByTestId('add-connection-button')).toBeVisible();
      await page.getByTestId('add-connection-button').click();
      await page
        .getByTestId('search-for-app-loader')
        .waitFor({ state: 'detached' });
    });

    test('lists applications', async ({ page, applicationsPage }) => {
      const appListItemCount = await page.getByTestId('app-list-item').count();
      expect(appListItemCount).toBeGreaterThan(10);

      await applicationsPage.clickAway();
    });

    test('searches an application', async ({ page, applicationsPage }) => {
      await page.getByTestId('search-for-app-text-field').fill('DeepL');
      await expect(page.getByTestId('app-list-item')).toHaveCount(1);

      await applicationsPage.clickAway();
    });

    test('goes to app page to create a connection', async ({
      page,
      applicationsPage,
    }) => {
      await page.getByTestId('app-list-item').first().click();
      await expect(page).toHaveURL('/app/deepl/connections/add');
      await expect(page.getByTestId('add-app-connection-dialog')).toBeVisible();

      await applicationsPage.clickAway();
    });

    test('closes the dialog on backdrop click', async ({
      page,
      applicationsPage,
    }) => {
      await page.getByTestId('app-list-item').first().click();
      await expect(page).toHaveURL('/app/deepl/connections/add');
      await expect(page.getByTestId('add-app-connection-dialog')).toBeVisible();
      await applicationsPage.clickAway();
      await expect(page).toHaveURL('/app/deepl/connections');
      await expect(page.getByTestId('add-app-connection-dialog')).toBeHidden();
    });
  });
});
