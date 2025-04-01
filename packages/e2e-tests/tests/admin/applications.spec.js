const { test, expect } = require('../../fixtures/index');
const { pgPool } = require('../../fixtures/postgres-config');
const { insertAppConnection } = require('../../helpers/db-helpers');

test.describe('Admin Applications', () => {
  test.beforeAll(async () => {
    const deleteOAuthClients = {
      text: 'DELETE FROM oauth_clients WHERE app_key in ($1, $2, $3, $4, $5, $6)',
      values: [
        'carbone',
        'spotify',
        'clickup',
        'mailchimp',
        'reddit',
        'google-drive',
      ],
    };

    const deleteAppConfigs = {
      text: 'DELETE FROM app_configs WHERE key in ($1, $2, $3, $4, $5, $6)',
      values: [
        'carbone',
        'spotify',
        'clickup',
        'mailchimp',
        'reddit',
        'google-drive',
      ],
    };

    try {
      const deleteOAuthClientsResult = await pgPool.query(deleteOAuthClients);
      expect(deleteOAuthClientsResult.command).toBe('DELETE');
      const deleteAppConfigsResult = await pgPool.query(deleteAppConfigs);
      expect(deleteAppConfigsResult.command).toBe('DELETE');
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  });

  test.beforeEach(async ({ adminApplicationsPage }) => {
    await adminApplicationsPage.navigateTo();
  });

  // TODO skip until https://github.com/automatisch/automatisch/pull/2244
  test.skip('Admin should be able to toggle Application settings', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    page,
  }) => {
    await adminApplicationsPage.openApplication('Carbone');
    await expect(page.url()).toContain('/admin-settings/apps/carbone/settings');

    await adminApplicationSettingsPage.allowUseOnlyPredefinedAuthClients();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectOnlyOneSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await page.reload();

    await adminApplicationSettingsPage.disallowUseOnlyPredefinedAuthClients();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectOnlyOneSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.allowConnections();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
  });

  test('should allow only custom connections', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    flowEditorPage,
    page,
  }) => {
    await insertAppConnection('google-drive');

    // TODO use openApplication method after fix
    // await adminApplicationsPage.openApplication('Google-Drive');
    await adminApplicationsPage.searchInput.fill('Google-Drive');
    await adminApplicationsPage.appRow
      .locator(page.getByText('Google Drive'))
      .click();

    await expect(page.url()).toContain(
      '/admin-settings/apps/google-drive/settings'
    );
    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();

    await expect(
      adminApplicationSettingsPage.useOnlyPredefinedAuthClients
    ).not.toBeChecked();
    await expect(
      adminApplicationSettingsPage.disableConnectionsSwitch
    ).not.toBeChecked();

    await adminApplicationOAuthClientsPage.openAuthClientsTab();
    await expect(
      adminApplicationOAuthClientsPage.createFirstAuthClientButton
    ).toHaveCount(1);

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);

    await flowEditorPage.chooseAppAndEvent(
      'Google Drive',
      'New files in folder'
    );
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add new connection' });
    const newOAuthConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add connection with OAuth client' });
    const existingConnection = page
      .getByRole('option')
      .filter({ hasText: 'Unnamed' });

    await expect.poll(() => existingConnection.count()).toBeGreaterThan(0);
    await expect(newConnectionOption).toBeEnabled();
    await expect(newConnectionOption).toHaveCount(1);
    await expect(newOAuthConnectionOption).toHaveCount(0);
  });

  test('should allow only predefined connections and existing custom', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    flowEditorPage,
    page,
  }) => {
    await insertAppConnection('spotify');

    await adminApplicationsPage.openApplication('Spotify');
    await expect(page.url()).toContain('/admin-settings/apps/spotify/settings');
    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();

    await expect(
      adminApplicationSettingsPage.useOnlyPredefinedAuthClients
    ).not.toBeChecked();
    await expect(
      adminApplicationSettingsPage.disableConnectionsSwitch
    ).not.toBeChecked();

    await adminApplicationSettingsPage.allowUseOnlyPredefinedAuthClients();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectOnlyOneSuccessSnackbarToBeVisible();

    await adminApplicationOAuthClientsPage.openAuthClientsTab();
    await adminApplicationOAuthClientsPage.openFirstAuthClientCreateForm();
    const authClientForm = page.getByTestId('auth-client-form');
    await authClientForm.locator(page.getByTestId('switch')).check();
    await authClientForm
      .locator(page.locator('[name="name"]'))
      .fill('spotifyAuthClient');
    await authClientForm
      .locator(page.locator('[name="clientId"]'))
      .fill('spotifyClientId');
    await authClientForm
      .locator(page.locator('[name="clientSecret"]'))
      .fill('spotifyClientSecret');
    await adminApplicationOAuthClientsPage.submitAuthClientForm();
    await adminApplicationOAuthClientsPage.authClientShouldBeVisible(
      'spotifyAuthClient'
    );

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent('Spotify', 'Create Playlist');
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add new connection' });
    const newOAuthConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add connection with OAuth client' });
    const existingConnection = page
      .getByRole('option')
      .filter({ hasText: 'Unnamed' });

    await expect.poll(() => existingConnection.count()).toBeGreaterThan(0);
    await expect(newConnectionOption).toHaveCount(0);
    await expect(newOAuthConnectionOption).toBeEnabled();
    await expect(newOAuthConnectionOption).toHaveCount(1);
  });

  test('should allow all connections', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    flowEditorPage,
    page,
  }) => {
    await insertAppConnection('reddit');

    await adminApplicationsPage.openApplication('Reddit');
    await expect(page.url()).toContain('/admin-settings/apps/reddit/settings');
    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();

    await expect(
      adminApplicationSettingsPage.useOnlyPredefinedAuthClients
    ).not.toBeChecked();
    await expect(
      adminApplicationSettingsPage.disableConnectionsSwitch
    ).not.toBeChecked();

    await adminApplicationOAuthClientsPage.openAuthClientsTab();
    await adminApplicationOAuthClientsPage.openFirstAuthClientCreateForm();

    const authClientForm = page.getByTestId('auth-client-form');
    await authClientForm.locator(page.getByTestId('switch')).check();
    await authClientForm
      .locator(page.locator('[name="name"]'))
      .fill('redditAuthClient');
    await authClientForm
      .locator(page.locator('[name="clientId"]'))
      .fill('redditClientId');
    await authClientForm
      .locator(page.locator('[name="clientSecret"]'))
      .fill('redditClientSecret');

    await adminApplicationOAuthClientsPage.submitAuthClientForm();
    await adminApplicationOAuthClientsPage.authClientShouldBeVisible(
      'redditAuthClient'
    );

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent('Reddit', 'Create link post');
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add new connection' });
    const newOAuthConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add connection with OAuth client' });
    const existingConnection = page
      .getByRole('option')
      .filter({ hasText: 'Unnamed' });

    await expect.poll(() => existingConnection.count()).toBeGreaterThan(0);
    await expect(newConnectionOption).toHaveCount(1);
    await expect(newOAuthConnectionOption).toBeEnabled();
    await expect(newOAuthConnectionOption).toHaveCount(1);
  });

  test('should not allow new connections but existing custom', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    flowEditorPage,
    page,
  }) => {
    await insertAppConnection('clickup');

    await adminApplicationsPage.openApplication('ClickUp');
    await expect(page.url()).toContain('/admin-settings/apps/clickup/settings');

    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();
    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectOnlyOneSuccessSnackbarToBeVisible();

    await adminApplicationOAuthClientsPage.openAuthClientsTab();
    await adminApplicationOAuthClientsPage.openFirstAuthClientCreateForm();

    const authClientForm = page.getByTestId('auth-client-form');
    await authClientForm.locator(page.getByTestId('switch')).check();
    await authClientForm
      .locator(page.locator('[name="name"]'))
      .fill('clickupAuthClient');
    await authClientForm
      .locator(page.locator('[name="clientId"]'))
      .fill('clickupClientId');
    await authClientForm
      .locator(page.locator('[name="clientSecret"]'))
      .fill('clickupClientSecret');
    await adminApplicationOAuthClientsPage.submitAuthClientForm();
    await adminApplicationOAuthClientsPage.authClientShouldBeVisible(
      'clickupAuthClient'
    );

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent('ClickUp', 'Create folder');
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add new connection' });
    const newOAuthConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add connection with OAuth client' });
    const existingConnection = page
      .getByRole('option')
      .filter({ hasText: 'Unnamed' });

    await expect.poll(() => existingConnection.count()).toBeGreaterThan(0);
    await expect(newConnectionOption).toHaveCount(0);
    await expect(newOAuthConnectionOption).toHaveCount(0);
  });

  test('should not allow new connections but existing custom even if predefined OAuth clients are enabled', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    flowEditorPage,
    page,
  }) => {
    await insertAppConnection('mailchimp');

    await adminApplicationsPage.openApplication('Mailchimp');
    await expect(page.url()).toContain(
      '/admin-settings/apps/mailchimp/settings'
    );
    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();

    await adminApplicationSettingsPage.allowUseOnlyPredefinedAuthClients();
    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.saveSettings();
    await adminApplicationSettingsPage.expectOnlyOneSuccessSnackbarToBeVisible();

    await adminApplicationOAuthClientsPage.openAuthClientsTab();
    await adminApplicationOAuthClientsPage.openFirstAuthClientCreateForm();

    const authClientForm = page.getByTestId('auth-client-form');
    await authClientForm.locator(page.getByTestId('switch')).check();
    await authClientForm
      .locator(page.locator('[name="name"]'))
      .fill('mailchimpAuthClient');
    await authClientForm
      .locator(page.locator('[name="clientId"]'))
      .fill('mailchimpClientId');
    await authClientForm
      .locator(page.locator('[name="clientSecret"]'))
      .fill('mailchimpClientSecret');
    await adminApplicationOAuthClientsPage.submitAuthClientForm();
    await adminApplicationOAuthClientsPage.authClientShouldBeVisible(
      'mailchimpAuthClient'
    );

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent('Mailchimp', 'Create campaign');
    await flowEditorPage.connectionAutocomplete.click();
    await expect(page.getByRole('option').first()).toHaveText('Unnamed');

    const existingConnection = page
      .getByRole('option')
      .filter({ hasText: 'Unnamed' });
    const newConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add new connection' });
    const newOAuthConnectionOption = page
      .getByRole('option')
      .filter({ hasText: 'Add connection with OAuth client' });
    const noConnectionsOption = page
      .locator('.MuiAutocomplete-noOptions')
      .filter({ hasText: 'No options' });

    await expect.poll(() => existingConnection.count()).toBeGreaterThan(0);
    await expect(noConnectionsOption).toHaveCount(0);
    await expect(newConnectionOption).toHaveCount(0);
    await expect(newOAuthConnectionOption).toHaveCount(0);
  });

  test('only disable option should be visible for non-OAuth integrations', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationOAuthClientsPage,
    page,
  }) => {
    await adminApplicationsPage.openApplication('RSS');
    await expect(page.url()).toContain('/admin-settings/apps/rss/settings');
    await expect(adminApplicationSettingsPage.pageTitle).toBeVisible();

    await expect(
      adminApplicationSettingsPage.useOnlyPredefinedAuthClients
    ).toHaveCount(0);
    await expect(adminApplicationOAuthClientsPage.authClientsTab).toHaveCount(
      0
    );
  });
});
