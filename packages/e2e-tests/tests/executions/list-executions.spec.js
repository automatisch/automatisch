const { request } = require('@playwright/test');
const { test, expect } = require('../../fixtures/index');
const {
  triggerFlow,
  publishFlow,
  addWebhookFlow,
} = require('../../helpers/flow-api-helper');
const { getToken } = require('../../helpers/auth-api-helper');

test.describe('Executions page', () => {
  let flowId;

  test.beforeAll(async () => {
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);

    flowId = await addWebhookFlow(apiRequest, tokenJsonResponse.data.token);

    const { data } = await publishFlow(
      apiRequest,
      tokenJsonResponse.data.token,
      flowId
    );

    const triggerStepWebhookUrl = data.steps.find(
      (step) => step.type === 'trigger'
    ).webhookUrl;

    await triggerFlow(apiRequest, triggerStepWebhookUrl);
  });

  test.beforeEach(async ({ page }) => {
    await page.getByTestId('executions-page-drawer-link').click();
  });

  test('should be able to see normal and test executions', async ({
    executionsPage,
  }) => {
    await executionsPage.executionsPageLoader.waitFor({
      state: 'detached',
    });
    const flowExecutions = await executionsPage.executionRow.filter({
      hasText: flowId,
    });

    await expect(flowExecutions).toHaveCount(4);
    await expect(flowExecutions.first()).toContainText('Success');
    await expect(flowExecutions.first()).not.toContainText('Test run');
    for (let testFlow = 1; testFlow < 4; testFlow++) {
      await expect(flowExecutions.nth(testFlow)).toContainText('Test run');
      await expect(flowExecutions.nth(testFlow)).toContainText('Success');
    }
  });
});
