const { request } = require('@playwright/test');
const { test, expect } = require('../../fixtures/index');
const {
  triggerFlow,
  publishFlow,
  addWebhookFlow,
} = require('../../helpers/flow-api-helper');
const {
  ExecutionStepDetails,
} = require('../../fixtures/execution-step-details');
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

  test('show only trigger step on test execution', async ({
    page,
    executionsPage,
    executionDetailsPage,
  }) => {
    await executionsPage.executionsPageLoader.waitFor({
      state: 'detached',
    });
    const flowExecutions = await executionsPage.executionRow.filter({
      hasText: flowId,
    });
    await expect(flowExecutions.last()).toContainText('Test run');
    await flowExecutions.last().click();

    await executionDetailsPage.verifyExecutionData(flowId);
    await expect(executionDetailsPage.executionStep).toHaveCount(1);

    const executionStepDetails = new ExecutionStepDetails(
      page,
      executionDetailsPage.executionStep.last()
    );
    await executionStepDetails.verifyTriggerExecutionStep({
      stepPositionAndName: '1. Webhook',
      stepDataInKey: 'workSynchronously',
      stepDataInValue: 'workSynchronously',
      stepDataOutKey: 'host',
      stepDataOutValue: 'localhost',
    });
  });

  test('show trigger and action step on action test execution', async ({
    page,
    executionsPage,
    executionDetailsPage,
  }) => {
    await executionsPage.executionsPageLoader.waitFor({
      state: 'detached',
    });
    const flowExecutions = await executionsPage.executionRow.filter({
      hasText: flowId,
    });
    await expect(flowExecutions.nth(1)).toContainText('Test run');
    await flowExecutions.nth(1).click();

    await expect(executionDetailsPage.executionStep).toHaveCount(2);
    await executionDetailsPage.verifyExecutionData(flowId);

    const firstExecutionStepDetails = new ExecutionStepDetails(
      page,
      executionDetailsPage.executionStep.first()
    );
    await firstExecutionStepDetails.verifyTriggerExecutionStep({
      stepPositionAndName: '1. Webhook',
      stepDataInKey: 'workSynchronously',
      stepDataInValue: 'workSynchronously',
      stepDataOutKey: 'host',
      stepDataOutValue: 'localhost',
    });

    const lastExecutionStepDetails = new ExecutionStepDetails(
      page,
      executionDetailsPage.executionStep.last()
    );
    await lastExecutionStepDetails.verifyActionExecutionStep({
      stepPositionAndName: '2. Webhook',
      stepDataInKey: 'body',
      stepDataInValue: 'body:"ok"',
      stepDataOutKey: 'body',
      stepDataOutValue: 'body:"ok"',
    });
  });

  test('show trigger and action step on flow execution', async ({
    page,
    executionsPage,
    executionDetailsPage,
  }) => {
    await executionsPage.executionsPageLoader.waitFor({
      state: 'detached',
    });
    const flowExecutions = await executionsPage.executionRow.filter({
      hasText: flowId,
    });
    await expect(flowExecutions.first()).not.toContainText('Test run');
    await flowExecutions.first().click();

    await expect(executionDetailsPage.executionStep).toHaveCount(2);
    await executionDetailsPage.verifyExecutionData(flowId);

    const firstExecutionStepDetails = new ExecutionStepDetails(
      page,
      executionDetailsPage.executionStep.first()
    );
    await firstExecutionStepDetails.verifyTriggerExecutionStep({
      stepPositionAndName: '1. Webhook',
      stepDataInKey: 'workSynchronously',
      stepDataInValue: 'workSynchronously',
      stepDataOutKey: 'host',
      stepDataOutValue: 'localhost',
    });

    const lastExecutionStepDetails = new ExecutionStepDetails(
      page,
      executionDetailsPage.executionStep.last()
    );
    await lastExecutionStepDetails.verifyActionExecutionStep({
      stepPositionAndName: '2. Webhook',
      stepDataInKey: 'body',
      stepDataInValue: 'body:"ok"',
      stepDataOutKey: 'body',
      stepDataOutValue: 'body:"ok"',
    });
  });
});
