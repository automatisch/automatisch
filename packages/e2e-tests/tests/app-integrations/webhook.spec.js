const { test, expect } = require('../../fixtures/index');

test.describe('Webhook flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );
    await expect(page.getByTestId('flow-step')).toHaveCount(2);
  });

  test('Create a new flow with a sync Webhook step then a Webhook step', async ({
    flowEditorPage,
    page,
    request,
  }) => {
    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('syncWebhook');
    const syncWebhookUrl = await flowEditorPage.createWebhookTrigger(true);

    await flowEditorPage.chooseAppAndEvent('Webhook', 'Respond with');

    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await expect(flowEditorPage.continueButton).not.toBeEnabled();

    await expect(
      page
        .getByTestId('parameters.statusCode-power-input')
        .locator('[contenteditable]')
    ).toHaveText('200');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await expect(flowEditorPage.continueButton).not.toBeEnabled();

    await page
      .getByTestId('parameters.body-power-input')
      .locator('[contenteditable]')
      .fill('response from webhook');
    await flowEditorPage.clickAway();
    await expect(
      page.getByTestId('parameters.headers.0.key-power-input')
    ).toBeVisible();
    await expect(flowEditorPage.continueButton).toBeEnabled();
    await flowEditorPage.continueButton.click();

    await flowEditorPage.testAndContinue();
    await flowEditorPage.publishFlowButton.click();
    await expect(flowEditorPage.infoSnackbar).toBeVisible();

    const response = await request.get(syncWebhookUrl);
    await expect(response.status()).toBe(200);
    await expect(await response.text()).toBe('response from webhook');
  });

  test('Create a new flow with an async Webhook step then a Webhook step', async ({
    flowEditorPage,
    page,
    request,
  }) => {
    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('asyncWebhook');
    const asyncWebhookUrl = await flowEditorPage.createWebhookTrigger(false);

    await flowEditorPage.chooseAppAndEvent('Webhook', 'Respond with');
    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await expect(flowEditorPage.continueButton).not.toBeEnabled();

    await page
      .getByTestId('parameters.statusCode-power-input')
      .locator('[contenteditable]')
      .fill('200');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await expect(flowEditorPage.continueButton).not.toBeEnabled();

    await page
      .getByTestId('parameters.body-power-input')
      .locator('[contenteditable]')
      .fill('response from webhook');
    await flowEditorPage.clickAway();
    await expect(
      page.getByTestId('parameters.headers.0.key-power-input')
    ).toBeVisible();
    await expect(flowEditorPage.continueButton).toBeEnabled();
    await flowEditorPage.continueButton.click();

    await flowEditorPage.testAndContinue();
    await flowEditorPage.publishFlowButton.click();
    await expect(flowEditorPage.infoSnackbar).toBeVisible();

    const response = await request.get(asyncWebhookUrl);
    await expect(response.status()).toBe(204);
    await expect(await response.text()).toBe('');
  });
});
