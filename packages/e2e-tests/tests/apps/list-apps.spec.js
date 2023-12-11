// @ts-check
const { test, expect } = require('../../fixtures/index');

test.describe('Apps page', () => {
  test.beforeEach(async ({ applicationsPage }) => {
    await applicationsPage.drawerLink.click();
  });

  // no connected application exists in an empty account
  test.skip('displays no applications', async ({ applicationsPage }) => {
    await applicationsPage.page.getByTestId('apps-loader').waitFor({
      state: 'detached',
    });
    await expect(applicationsPage.page.getByTestId('app-row')).not.toHaveCount(
      0
    );

    await applicationsPage.screenshot({
      path: 'Applications.png',
    });
  });

  test.describe('can add connection', () => {
    test.beforeEach(async ({ applicationsPage }) => {
      await expect(applicationsPage.addConnectionButton).toBeClickableLink();
      await applicationsPage.addConnectionButton.click();
      await applicationsPage.page
        .getByTestId('search-for-app-loader')
        .waitFor({ state: 'detached' });
    });

    test('lists applications', async ({ applicationsPage }) => {
      const appListItemCount = await applicationsPage.page
        .getByTestId('app-list-item')
        .count();
      expect(appListItemCount).toBeGreaterThan(10);

      await applicationsPage.clickAway();
    });

    test('searches an application', async ({ applicationsPage }) => {
      await applicationsPage.page
        .getByTestId('search-for-app-text-field')
        .fill('DeepL');
      await applicationsPage.page
        .getByTestId('search-for-app-loader')
        .waitFor({ state: 'detached' });

      await expect(
        applicationsPage.page.getByTestId('app-list-item')
      ).toHaveCount(1);

      await applicationsPage.clickAway();
    });

    test('goes to app page to create a connection', async ({
      applicationsPage,
    }) => {
      // loading app, app config, app auth clients take time
      test.setTimeout(60000);

      await applicationsPage.page.getByTestId('app-list-item').first().click();
      await expect(applicationsPage.page).toHaveURL(
        '/app/better-stack/connections/add?shared=false'
      );
      await expect(
        applicationsPage.page.getByTestId('add-app-connection-dialog')
      ).toBeVisible();

      await applicationsPage.clickAway();
    });

    test('closes the dialog on backdrop click', async ({
      applicationsPage,
    }) => {
      await applicationsPage.page.getByTestId('app-list-item').first().click();
      await expect(applicationsPage.page).toHaveURL(
        '/app/better-stack/connections/add?shared=false'
      );
      await expect(
        applicationsPage.page.getByTestId('add-app-connection-dialog')
      ).toBeVisible();
      await applicationsPage.clickAway();
      await expect(applicationsPage.page).toHaveURL(
        '/app/better-stack/connections'
      );
      await expect(
        applicationsPage.page.getByTestId('add-app-connection-dialog')
      ).toBeHidden();
    });
  });
});
