const { test, expect } = require('../../fixtures/index');
const { request } = require('@playwright/test');
const {
  getApiTokens,
  removeApiToken,
} = require('../../helpers/api-tokens-helper');
const { getToken } = require('../../helpers/auth-api-helper');

test.describe.serial('API Tokens Management', () => {
  test.beforeEach(async ({ apiTokensPage }) => {
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);
    const tokens = await getApiTokens(apiRequest, tokenJsonResponse.data.token);
    tokens.data.forEach(async (element) => {
      await removeApiToken(
        apiRequest,
        tokenJsonResponse.data.token,
        element.id
      );
    });

    await apiTokensPage.navigateTo();
  });

  test('API tokens lifecycle', async ({ apiTokensPage, page }) => {
    let copiedToken = '';

    await test.step('Navigate to API tokens page and verify empty state', async () => {
      await expect(apiTokensPage.noResults).toBeVisible();
      await expect(apiTokensPage.createTokenButton).toBeVisible();
    });

    await test.step('Click create token button and verify dialog appears', async () => {
      await apiTokensPage.noResults.click();
      await expect(apiTokensPage.apiTokenValue).toBeVisible();
      await expect(apiTokensPage.copyTokenButton).toBeVisible();
      await expect(apiTokensPage.closeButton).toBeVisible();
    });

    await test.step('Verify token value is generated', async () => {
      const tokenValue = await apiTokensPage.apiTokenValue.inputValue();
      expect(tokenValue.length).toBeGreaterThan(0);
    });

    await test.step('Copy token to clipboard', async () => {
      const tokenValue = await apiTokensPage.apiTokenValue.inputValue();

      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      await apiTokensPage.copyTokenButton.click();

      copiedToken = await page.evaluate(() => navigator.clipboard.readText());

      expect(copiedToken).toBe(tokenValue);
    });

    await test.step('Use token to make authenticated API request', async () => {
      const response = await page.request.get('/api/v1/apps', {
        headers: {
          'x-api-token': `${copiedToken}`,
        },
      });
      expect(response.status()).toBe(200);
      const responseJsonFormat = await response.json();
      expect(responseJsonFormat).toHaveProperty('data');
      expect(responseJsonFormat.data[0]).toHaveProperty('name');
    });

    await test.step('Close dialog and verify token appears in list', async () => {
      await apiTokensPage.closeButton.click();
      await expect(apiTokensPage.apiTokenRow).toBeVisible();
      await expect(apiTokensPage.noResults).not.toBeVisible();
    });

    await test.step('Verify token row contains expected information', async () => {
      const tokenRow = apiTokensPage.apiTokenRow.first();

      const rowText = await tokenRow.textContent();
      expect(rowText.length).toBeGreaterThan(0);
      expect(rowText).toContain('...');
      await expect(tokenRow.locator(apiTokensPage.deleteButton)).toBeVisible();
    });

    await test.step('Click on token row and verify no edit dialog appears', async () => {
      const currentUrl = page.url();
      await apiTokensPage.apiTokenRow.first().click();

      expect(page.url()).toBe(currentUrl);

      await expect(apiTokensPage.apiTokenValue).not.toBeVisible();
    });

    await test.step('Delete the token', async () => {
      const initialTokenCount = await apiTokensPage.apiTokenRow.count();
      await apiTokensPage.apiTokenRow
        .filter({ hasText: copiedToken.substring(0, 3) })
        .locator(apiTokensPage.deleteButton)
        .click();
      await apiTokensPage.confirmDeleteButton.click();

      await expect(apiTokensPage.apiTokenRow).toHaveCount(
        initialTokenCount - 1
      );
      await expect(
        await apiTokensPage.apiTokenRow.filter({
          hasText: copiedToken.substring(0, 3),
        })
      ).toHaveCount(0);
    });

    await test.step('Removed token cannot be used for API request', async () => {
      const response = await page.request.get('/api/v1/apps', {
        headers: {
          'x-api-token': `${copiedToken}`,
        },
      });
      expect(response.status()).toBe(401);
    });
  });

  test('can create API token via button on the top right corner', async ({
    apiTokensPage,
  }) => {
    await test.step('Create first token to populate list', async () => {
      await apiTokensPage.createTokenButton.click();
      await apiTokensPage.closeButton.click();
    });

    await test.step('Verify create button is still available when tokens exist', async () => {
      await expect(apiTokensPage.createTokenButton).toBeVisible();
      await expect(apiTokensPage.apiTokenRow).toBeVisible();
    });

    await test.step('Create second token', async () => {
      await apiTokensPage.createTokenButton.click();
      await expect(apiTokensPage.apiTokenValue).toBeVisible();
      await apiTokensPage.closeButton.click();
    });

    await test.step('Verify multiple tokens appear in list', async () => {
      await expect(apiTokensPage.apiTokenRow).toHaveCount(2);
    });
  });
});
