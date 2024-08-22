const { test, expect } = require('../../fixtures/index');
const axios = require('axios');

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
  }) => {
    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('syncWebhook');
    const syncWebhookUrl = await flowEditorPage.createWebhookTrigger(true);

    await flowEditorPage.chooseAppAndEvent('Webhook', 'Respond with');

    await expect(flowEditorPage.continueButton.last()).not.toBeEnabled();

    await page
      .getByTestId('parameters.statusCode-power-input')
      .locator('[contenteditable]')
      .fill('200');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton.last()).not.toBeEnabled();

    await page
      .getByTestId('parameters.body-power-input')
      .locator('[contenteditable]')
      .fill('response from webhook');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton).toBeEnabled();
    await flowEditorPage.continueButton.click();

    await flowEditorPage.testAndContinue();
    await flowEditorPage.publishFlowButton.click();

    const response = await axios.get(syncWebhookUrl);
    await expect(response.status).toBe(200);
    await expect(response.data).toBe('response from webhook');
  });

  test('Create a new flow with an async Webhook step then a Webhook step', async ({
    flowEditorPage,
    page,
  }) => {
    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('asyncWebhook');
    const asyncWebhookUrl = await flowEditorPage.createWebhookTrigger(false);

    await flowEditorPage.chooseAppAndEvent('Webhook', 'Respond with');

    await expect(flowEditorPage.continueButton.last()).not.toBeEnabled();

    await page
      .getByTestId('parameters.statusCode-power-input')
      .locator('[contenteditable]')
      .fill('200');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton.last()).not.toBeEnabled();

    await page
      .getByTestId('parameters.body-power-input')
      .locator('[contenteditable]')
      .fill('response from webhook');
    await flowEditorPage.clickAway();
    await expect(flowEditorPage.continueButton).toBeEnabled();
    await flowEditorPage.continueButton.click();

    await flowEditorPage.testAndContinue();
    await flowEditorPage.publishFlowButton.click();

    const response = await axios.get(asyncWebhookUrl);
    await expect(response.status).toBe(204);
    await expect(response.data).toBe('');
  });
});
