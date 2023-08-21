// @ts-check
const { test, expect } = require('../../fixtures/index');

test.describe('Connections page', () => {
  test.beforeEach(async ({ page, connectionsPage }) => {
    await page.getByTestId('apps-page-drawer-link').click();
    await page.goto('/app/ntfy/connections');
  });

  test('shows connections if any', async ({ page, connectionsPage }) => {
    await page.getByTestId('apps-loader').waitFor({
      state: 'detached',
    });

    await connectionsPage.screenshot({
      path: 'Connections.png',
    });
  });

  test.describe('can add connection', () => {
    test('has a button to open add connection dialog', async ({ page }) => {
      await expect(page.getByTestId('add-connection-button')).toBeClickableLink();
    });

    test('add connection button takes user to add connection page', async ({
      page,
      connectionsPage,
    }) => {
      await connectionsPage.clickAddConnectionButton();
      await expect(page).toHaveURL('/app/ntfy/connections/add?shared=false');
    });

    test('shows add connection dialog to create a new connection', async ({
      page,
      connectionsPage,
    }) => {
      await connectionsPage.clickAddConnectionButton();
      await expect(page).toHaveURL('/app/ntfy/connections/add?shared=false');
      await page.getByTestId('create-connection-button').click();
      await expect(
        page.getByTestId('create-connection-button')
      ).not.toBeVisible();

      await connectionsPage.screenshot({
        path: 'Ntfy connections after creating a connection.png',
      });
    });
  });
});
