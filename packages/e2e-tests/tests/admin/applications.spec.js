const { test, expect } = require('../../fixtures/index');
const { pgPool } = require('../../fixtures/postgres-config');

test.describe('Admin Applications', () => {
  test.beforeAll(async () => {
    const deleteAppAuthClients = {
      text: 'DELETE FROM app_auth_clients WHERE app_key in ($1, $2, $3, $4, $5)',
      values: ['carbone', 'spotify', 'deepl', 'mailchimp', 'reddit']
    };

    const deleteAppConfigs = {
      text: 'DELETE FROM app_configs WHERE key in ($1, $2, $3, $4, $5)',
      values: ['carbone', 'spotify', 'deepl', 'mailchimp', 'reddit']
    };

    try {
      const deleteAppAuthClientsResult = await pgPool.query(deleteAppAuthClients);
      expect(deleteAppAuthClientsResult.command).toBe('DELETE');
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

  test('Admin should be able to toggle Application settings', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    page
  }) => {
    await adminApplicationsPage.openApplication('Carbone');
    await expect(page.url()).toContain('/admin-settings/apps/carbone/settings');

    await adminApplicationSettingsPage.allowCustomConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.allowSharedConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await page.reload();

    await adminApplicationSettingsPage.disallowCustomConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.disallowSharedConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
    await adminApplicationSettingsPage.allowConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();
  });

  test('should allow only custom connections', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    flowEditorPage,
    page
  }) => {
    await adminApplicationsPage.openApplication('Spotify');
    await expect(page.url()).toContain('/admin-settings/apps/spotify/settings');

    await adminApplicationSettingsPage.allowCustomConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent("Spotify", "Create Playlist");
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page.getByRole('option').filter({ hasText: 'Add new connection' });
    const newSharedConnectionOption = page.getByRole('option').filter({ hasText: 'Add new shared connection' });

    await expect(newConnectionOption).toBeEnabled();
    await expect(newConnectionOption).toHaveCount(1);
    await expect(newSharedConnectionOption).toHaveCount(0);
  });

  test('should allow only shared connections', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    adminApplicationAuthClientsPage,
    flowEditorPage,
    page
  }) => {
    await adminApplicationsPage.openApplication('Reddit');
    await expect(page.url()).toContain('/admin-settings/apps/reddit/settings');

    await adminApplicationSettingsPage.allowSharedConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await adminApplicationAuthClientsPage.openAuthClientsTab();
    await adminApplicationAuthClientsPage.openFirstAuthClientCreateForm();
    const authClientForm = page.getByTestId("auth-client-form");
    await authClientForm.locator(page.getByTestId('switch')).check();
    await authClientForm.locator(page.locator('[name="name"]')).fill('redditAuthClient');
    await authClientForm.locator(page.locator('[name="clientId"]')).fill('redditClientId');
    await authClientForm.locator(page.locator('[name="clientSecret"]')).fill('redditClientSecret');
    await adminApplicationAuthClientsPage.submitAuthClientForm();
    await adminApplicationAuthClientsPage.authClientShouldBeVisible('redditAuthClient');

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent("Reddit", "Create link post");
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page.getByRole('option').filter({ hasText: 'Add new connection' });
    const newSharedConnectionOption = page.getByRole('option').filter({ hasText: 'Add new shared connection' });

    await expect(newConnectionOption).toHaveCount(0);
    await expect(newSharedConnectionOption).toBeEnabled();
    await expect(newSharedConnectionOption).toHaveCount(1);
  });

  test('should not allow any connections', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    flowEditorPage,
    page
  }) => {
    await adminApplicationsPage.openApplication('DeepL');
    await expect(page.url()).toContain('/admin-settings/apps/deepl/settings');

    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent("DeepL", "Translate text");
    await flowEditorPage.connectionAutocomplete.click();

    const newConnectionOption = page.getByRole('option').filter({ hasText: 'Add new connection' });
    const newSharedConnectionOption = page.getByRole('option').filter({ hasText: 'Add new shared connection' });
    const noConnectionsOption = page.locator('.MuiAutocomplete-noOptions').filter({ hasText: 'No options' });

    await expect(noConnectionsOption).toHaveCount(1);
    await expect(newConnectionOption).toHaveCount(0);
    await expect(newSharedConnectionOption).toHaveCount(0);
  });

  test('should not allow new connections but only already created', async ({
    adminApplicationsPage,
    adminApplicationSettingsPage,
    flowEditorPage,
    page
  }) => {
    const queryUser = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [process.env.LOGIN_EMAIL]
    };

    try {
      const queryUserResult = await pgPool.query(queryUser);
      expect(queryUserResult.rowCount).toEqual(1);

      const createMailchimpConnection = {
        text: 'INSERT INTO connections (key, data, user_id, verified, draft) VALUES ($1, $2, $3, $4, $5)',
        values: [
          'mailchimp',
          "U2FsdGVkX1+cAtdHwLiuRL4DaK/T1aljeeKyPMmtWK0AmAIsKhYwQiuyQCYJO3mdZ31z73hqF2Y+yj2Kn2/IIpLRqCxB2sC0rCDCZyolzOZ290YcBXSzYRzRUxhoOcZEtwYDKsy8AHygKK/tkj9uv9k6wOe1LjipNik4VmRhKjEYizzjLrJpbeU1oY+qW0GBpPYomFTeNf+MejSSmsUYyYJ8+E/4GeEfaonvsTSwMT7AId98Lck6Vy4wrfgpm7sZZ8xU15/HqXZNc8UCo2iTdw45xj/Oov9+brX4WUASFPG8aYrK8dl/EdaOvr89P8uIofbSNZ25GjJvVF5ymarrPkTZ7djjJXchzpwBY+7GTJfs3funR/vIk0Hq95jgOFFP1liZyqTXSa49ojG3hzojRQ==",
          queryUserResult.rows[0].id,
          'true',
          'false'
        ],
      };

      const createMailchimpConnectionResult = await pgPool.query(createMailchimpConnection);
      expect(createMailchimpConnectionResult.rowCount).toBe(1);
      expect(createMailchimpConnectionResult.command).toBe('INSERT');
    } catch (err) {
      console.error(err.message);
      throw err;
    }

    await adminApplicationsPage.openApplication('Mailchimp');
    await expect(page.url()).toContain('/admin-settings/apps/mailchimp/settings');

    await adminApplicationSettingsPage.disallowConnections();
    await adminApplicationSettingsPage.expectSuccessSnackbarToBeVisible();

    await page.goto('/');
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    await expect(flowEditorPage.flowStep).toHaveCount(2);
    const triggerStep = flowEditorPage.flowStep.last();
    await triggerStep.click();

    await flowEditorPage.chooseAppAndEvent("Mailchimp", "Create campaign");
    await flowEditorPage.connectionAutocomplete.click();
    await expect(page.getByRole('option').first()).toHaveText('Unnamed');

    const existingConnection = page.getByRole('option').filter({ hasText: 'Unnamed' });
    const newConnectionOption = page.getByRole('option').filter({ hasText: 'Add new connection' });
    const newSharedConnectionOption = page.getByRole('option').filter({ hasText: 'Add new shared connection' });
    const noConnectionsOption = page.locator('.MuiAutocomplete-noOptions').filter({ hasText: 'No options' });

    await expect(await existingConnection.count()).toBeGreaterThan(0);
    await expect(noConnectionsOption).toHaveCount(0);
    await expect(newConnectionOption).toHaveCount(0);
    await expect(newSharedConnectionOption).toHaveCount(0);
  });
});
