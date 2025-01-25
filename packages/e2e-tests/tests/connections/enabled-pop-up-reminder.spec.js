const { request } = require('@playwright/test');
const { test, expect } = require('../../fixtures/index');
const {
  AddMattermostConnectionModal,
} = require('../../fixtures/apps/mattermost/add-mattermost-connection-modal');
const {
  createFlow,
  updateFlowName,
  getFlow,
  updateFlowStep,
  testStep,
} = require('../../helpers/flow-api-helper');
const { getToken } = require('../../helpers/auth-api-helper');

test.describe('Pop-up message on connections', () => {
  test.beforeEach(async ({ flowEditorPage, page }) => {
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);
    const token = tokenJsonResponse.data.token;

    let flow = await createFlow(apiRequest, token);
    const flowId = flow.data.id;
    await updateFlowName(apiRequest, token, flowId);
    flow = await getFlow(apiRequest, token, flowId);
    const flowSteps = flow.data.steps;
    const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
    const actionStepId = flowSteps.find((step) => step.type === 'action').id;

    const triggerStep = await updateFlowStep(apiRequest, token, triggerStepId, {
      appKey: 'webhook',
      key: 'catchRawWebhook',
      parameters: {
        workSynchronously: false,
      },
    });
    await apiRequest.get(triggerStep.data.webhookUrl);
    await testStep(apiRequest, token, triggerStepId);

    await updateFlowStep(apiRequest, token, actionStepId, {
      appKey: 'mattermost',
      key: 'sendMessageToChannel',
    });
    await testStep(apiRequest, token, actionStepId);

    await page.reload();

    const flowRow = await page.getByTestId('flow-row').filter({
      hasText: flowId,
    });
    await flowRow.click();
    const flowTriggerStep = await page.getByTestId('flow-step').nth(1);
    await flowTriggerStep.click();
    await page.getByText('Choose connection').click();

    await flowEditorPage.connectionAutocomplete.click();
    await flowEditorPage.addNewConnectionItem.click();
  });

  test('should show error to remind to enable pop-up on connection create', async ({
    page,
  }) => {
    const addMattermostConnectionModal = new AddMattermostConnectionModal(page);

    // Inject script to override window.open
    await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      window.open = function () {
        console.log('Popup blocked!');
        return null;
      };
    });

    await addMattermostConnectionModal.fillConnectionForm();
    await addMattermostConnectionModal.submitConnectionForm();

    await expect(page.getByTestId('add-connection-error')).toHaveCount(1);
    await expect(page.getByTestId('add-connection-error')).toHaveText(
      'Make sure pop-ups are enabled in your browser.'
    );
  });

  test('should not show pop-up error if pop-ups are enabled on connection create', async ({
    page,
  }) => {
    const addMattermostConnectionModal = new AddMattermostConnectionModal(page);

    await addMattermostConnectionModal.fillConnectionForm();
    const popupPromise = page.waitForEvent('popup');
    await addMattermostConnectionModal.submitConnectionForm();

    const popup = await popupPromise;
    await expect(popup.url()).toContain('mattermost');
    await expect(page.getByTestId('add-connection-error')).toHaveCount(0);

    await test.step('Should show error on failed credentials verification', async () => {
      await popup.close();
      await expect(page.getByTestId('add-connection-error')).toHaveCount(1);
      await expect(page.getByTestId('add-connection-error')).toHaveText(
        'Error occured while verifying credentials!'
      );
    });
  });
});
