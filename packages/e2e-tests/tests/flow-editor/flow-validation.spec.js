const { test, expect } = require('../../fixtures/index');
const { expectNoDelayedJobForFlow } = require('../../fixtures/bullmq-helper');
const { flowShouldNotHavePublishedAtDateFilled } = require('../../fixtures/postgres/postgres-helper');

test.describe('Flow Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );
    await expect(page.getByTestId('flow-step')).toHaveCount(2);
  });

  test('Should not be able to publish flow without trigger', async ({
    flowEditorPage,
    page,
    request
  }) => {
    const flowId = await page.url().split('editor/').pop();

    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('incompleteFlow');
    await flowEditorPage.chooseAppAndTrigger('RSS', 'New items in feed');

    await flowEditorPage.publishFlowButton.click();
    await flowEditorPage.dismissErrorSnackbar();

    await flowShouldNotHavePublishedAtDateFilled(flowId);
    await expectNoDelayedJobForFlow(flowId, request);

    await flowEditorPage.rssFeedUrl.fill('http://rss.cnn.com/rss/money_mostpopular.rss');
    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await flowEditorPage.continueButton.click();

    await flowEditorPage.publishFlowButton.click();
    await flowEditorPage.dismissErrorSnackbar();

    await flowShouldNotHavePublishedAtDateFilled(flowId);
    await expectNoDelayedJobForFlow(flowId, request);

    await expect(flowEditorPage.testOutput).not.toBeVisible();
    await flowEditorPage.testAndContinueButton.click();
    await expect(flowEditorPage.testOutput).toBeVisible();
    await expect(flowEditorPage.hasNoOutput).not.toBeVisible();
    await flowEditorPage.continueButton.click();

    await flowEditorPage.publishFlowButton.click();
    await expect(page.getByTestId('snackbar-error')).toBeVisible();

    await flowShouldNotHavePublishedAtDateFilled(flowId);
    await expectNoDelayedJobForFlow(flowId, request);
  });
});
