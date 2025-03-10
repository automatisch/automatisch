const { test, expect } = require('../../fixtures/index');
const axios = require('axios');
const {
  createFlow,
  updateFlowName,
  getFlow,
  updateFlowStep,
  testStep,
  createConnection,
  verifyConnection,
} = require('../../helpers/flow-api-helper');
const { getToken } = require('../../helpers/auth-api-helper');
const { ImportFlowDialog } = require('../../fixtures/import-flow-dialog');

test.describe('Import/Export flow', () => {
  test('export flow from the details with variables, step names', async ({
    page,
    request,
    flowEditorPage,
    flowsPage,
  }) => {
    let flowId;
    const importFlowDialog = new ImportFlowDialog(page);

    await test.step('create flow', async () => {
      const tokenJsonResponse = await getToken(request);
      const token = tokenJsonResponse.data.token;
      let flow = await createFlow(request, token);
      flowId = flow.data.id;
      await updateFlowName(request, token, flowId);
      flow = await getFlow(request, token, flowId);
      const flowSteps = flow.data.steps;

      const triggerStepId = flowSteps.find(
        (step) => step.type === 'trigger'
      ).id;
      const actionStepId = flowSteps.find((step) => step.type === 'action').id;

      const triggerStep = await updateFlowStep(request, token, triggerStepId, {
        appKey: 'webhook',
        key: 'catchRawWebhook',
        name: 'triggerStep',
        parameters: {
          workSynchronously: true,
        },
      });
      await request.get(triggerStep.data.webhookUrl);
      await testStep(request, token, triggerStepId);

      await updateFlowStep(request, token, actionStepId, {
        appKey: 'webhook',
        key: 'respondWith',
        name: 'actionStep',
        parameters: {
          statusCode: '200',
          body: `{{step.${triggerStepId}.headers.host}}`,
          headers: [
            {
              key: '',
              value: '',
            },
          ],
        },
      });
      await testStep(request, token, actionStepId);
    });

    await test.step('open added flow', async () => {
      await page.goto(`/editor/${flowId}`);
    });

    await test.step('export and import flow', async () => {
      const downloadPromise = page.waitForEvent('download');
      await flowEditorPage.exportFlowButton.click();
      const download = await downloadPromise;

      await download.saveAs(download.suggestedFilename());

      await flowEditorPage.goBackButton.click();

      await flowsPage.importFlowButton.click();
      await importFlowDialog.fileInput.setInputFiles(
        download.suggestedFilename()
      );
      await expect(importFlowDialog.fileNameWrapper).toHaveText(
        `Selected file:${flowId}.json`
      );
      await importFlowDialog.importButton.click();

      await expect(importFlowDialog.successAlert).toHaveText(
        'The flow has been successfully imported. You can view it here.'
      );
      await importFlowDialog.successAlertLink.click();
    });

    await test.step('verify imported flow', async () => {
      await expect(flowEditorPage.stepName.first()).toHaveText(
        '1. triggerStep'
      );
      await flowEditorPage.continueButton.click();
      await expect(
        page
          .getByTestId('parameters.workSynchronously-autocomplete')
          .first()
          .getByRole('combobox')
      ).toHaveValue('Yes');

      await flowEditorPage.continueButton.last().click();

      const webhookUrl = await page.locator('input[name="webhookUrl"]');
      await axios.get(await webhookUrl.inputValue());

      await flowEditorPage.testAndContinueButton.click();

      await expect(flowEditorPage.stepName.nth(1)).toHaveText('2. actionStep');
      await flowEditorPage.continueButton.last().click();
      await expect(flowEditorPage.appAutocompleteInput).toHaveValue('Webhook');

      await flowEditorPage.continueButton.last().click();
      await expect(
        page
          .getByTestId('parameters.body-power-input')
          .locator('[contenteditable="true"]')
      ).toContainText('step1.headers.host: localhost:3000');
    });
  });

  test('export flow from the Flow List', async ({
    page,
    request,
    flowsPage,
  }) => {
    const tokenJsonResponse = await getToken(request);
    const token = tokenJsonResponse.data.token;
    let flow = await createFlow(request, token);
    const flowId = flow.data.id;
    await updateFlowName(request, token, flowId);
    await page.goto('/flows');

    await expect(page).toHaveURL('/flows');
    await expect(
      flowsPage.flowRow.filter({
        hasText: flowId,
      })
    ).toHaveCount(1);
    await flowsPage.flowRow
      .filter({
        hasText: flowId,
      })
      .getByRole('button')
      .click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Export' }).click();
    const download = await downloadPromise;
    await download.saveAs(download.suggestedFilename());
  });

  test('import flow and check if flow is not in status to publish', async ({
    page,
    flowEditorPage,
    flowsPage,
  }) => {
    const importFlowDialog = new ImportFlowDialog(page);

    await flowsPage.importFlowButton.click();
    await importFlowDialog.fileInput.setInputFiles({
      name: 'flow.json',
      mimeType: 'application/json',
      buffer: Buffer.from(`
          {
            "id": "b85d6ceb-4220-4afa-965a-c43fa01e96e0",
            "name": "Name your flow",
            "steps": [
              {
                "id": "3987bcb5-b33c-4f1c-964a-eff5a54d1fd4",
                "key": "catchRawWebhook",
                "name": "Catch raw webhook",
                "appKey": "webhook",
                "type": "trigger",
                "parameters": {
                  "workSynchronously": false
                },
                "position": 1,
                "webhookPath": "/webhooks/flows/b85d6ceb-4220-4afa-965a-c43fa01e96e0"
              },
              {
                "id": "49ba3181-d7b0-462b-b62f-005d50689f87",
                "key": "respondWith",
                "name": "Respond with",
                "appKey": "webhook",
                "type": "action",
                "parameters": {
                  "body": "{{step.3987bcb5-b33c-4f1c-964a-eff5a54d1fd4.headers.host}}",
                  "headers": [
                    {
                      "key": "abc",
                      "__id": "21a0bfa9-7928-4e42-9e56-f4d68b8ff7aa",
                      "value": "{{step.3da3f847-efda-42b7-adbe-f0203a3491b8.headers.host}}"
                    }
                  ],
                  "statusCode": "200"
                },
                "position": 2
              }
            ]
          }`),
    });
    await expect(importFlowDialog.fileNameWrapper).toHaveText(
      'Selected file:flow.json'
    );
    await importFlowDialog.importButton.click();

    await expect(importFlowDialog.successAlert).toHaveText(
      'The flow has been successfully imported. You can view it here.'
    );
    await importFlowDialog.successAlertLink.click();

    await flowEditorPage.publishFlowButton.click();
    const snackbar = await page.getByTestId('snackbar-error');
    await expect(snackbar).toHaveText(
      'All steps should be completed before updating flow status!'
    );
  });

  test('connection should not be exported', async ({
    page,
    request,
    flowEditorPage,
    flowsPage,
  }) => {
    let flowId;
    const importFlowDialog = new ImportFlowDialog(page);

    await test.step('create flow', async () => {
      const tokenJsonResponse = await getToken(request);
      const token = tokenJsonResponse.data.token;
      let flow = await createFlow(request, token);
      flowId = flow.data.id;
      await updateFlowName(request, token, flowId);
      flow = await getFlow(request, token, flowId);
      const flowSteps = flow.data.steps;

      const triggerStepId = flowSteps.find(
        (step) => step.type === 'trigger'
      ).id;
      const actionStepId = flowSteps.find((step) => step.type === 'action').id;

      const triggerStep = await updateFlowStep(request, token, triggerStepId, {
        appKey: 'webhook',
        key: 'catchRawWebhook',
        name: 'triggerStep',
        parameters: {
          workSynchronously: true,
        },
      });
      await request.get(triggerStep.data.webhookUrl);
      await testStep(request, token, triggerStepId);

      const connection = await createConnection(request, token, 'postgresql', {
        formattedData: {
          version: '14.5',
          host: process.env.POSTGRES_HOST,
          port: '5432',
          enableSsl: 'false',
          database: process.env.POSTGRES_DATABASE,
          user: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
        },
      });

      await verifyConnection(request, token, connection.data.id);
      await updateFlowStep(request, token, actionStepId, {
        appKey: 'postgresql',
        key: 'SQLQuery',
        name: 'SQLQuery',
        connectionId: connection.data.id,
        parameters: {
          queryStatement: 'select * from users;',
          params: [
            {
              parameter: '',
              value: '',
            },
          ],
        },
      });
      await testStep(request, token, actionStepId);
    });

    await test.step('open added flow', async () => {
      await page.goto(`/editor/${flowId}`);
    });

    await test.step('export and import flow', async () => {
      const downloadPromise = page.waitForEvent('download');
      await flowEditorPage.exportFlowButton.click();
      const download = await downloadPromise;
      await download.saveAs(download.suggestedFilename());

      await expect(page.getByTestId('snackbar')).toHaveText(
        'The flow export has been successfully generated.'
      );
      await page.getByTestId('snackbar').click();

      await flowEditorPage.goBackButton.click();

      await flowsPage.importFlowButton.click();
      await importFlowDialog.fileInput.setInputFiles(
        download.suggestedFilename()
      );

      await expect(importFlowDialog.fileNameWrapper).toHaveText(
        `Selected file:${flowId}.json`
      );
      await importFlowDialog.importButton.click();
      await expect(importFlowDialog.successAlert).toHaveText(
        'The flow has been successfully imported. You can view it here.'
      );
      await importFlowDialog.successAlertLink.click();
    });

    await test.step('verify imported flow', async () => {
      await flowEditorPage.flowStep.last().click();
      await expect(flowEditorPage.appAutocompleteInput).toHaveCount(1);
      await expect(flowEditorPage.appAutocompleteInput).toHaveValue(
        'PostgreSQL'
      );
      await expect(flowEditorPage.eventAutocompleteInput).toHaveValue(
        'SQL query'
      );
      await flowEditorPage.continueButton.click();
      await expect(flowEditorPage.connectionAutocompleteInput).toHaveValue('');
      await page.getByText('Set up action').click();
      await expect(
        page
          .getByTestId('parameters.queryStatement-power-input')
          .locator('[contenteditable]')
      ).toHaveText('select * from users;');
    });
  });

  // ellipsis if not verified properly
  test.skip('handle long file names', async ({ flowsPage, page }) => {
    const importFlowDialog = new ImportFlowDialog(page);

    await flowsPage.importFlowButton.click();
    await importFlowDialog.fileInput.setInputFiles({
      name: 'very_long_file_name_with_some_additional_remarks_that_should_not_be_visible.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test'),
    });

    await expect(importFlowDialog.fileName).toHaveText(
      'very_long_file_name_with_some_additional_remark...'
    );
  });

  test('should fail on import different file than json', async ({
    flowsPage,
    page,
  }) => {
    const importFlowDialog = new ImportFlowDialog(page);

    await flowsPage.importFlowButton.click();
    await importFlowDialog.fileInput.setInputFiles({
      name: 'abc.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is test'),
    });

    await expect(importFlowDialog.fileNameWrapper).toHaveText(
      'Selected file:abc.txt'
    );
    await importFlowDialog.importButton.click();
    await expect(importFlowDialog.importParsingError).toHaveText(
      'Something has gone wrong with parsing the selected file.'
    );
  });

  test('import invalid nonflow json', async ({ flowsPage, page }) => {
    const importFlowDialog = new ImportFlowDialog(page);

    await flowsPage.importFlowButton.click();
    await importFlowDialog.fileInput.setInputFiles({
      name: 'abcd.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"this": "is test"}'),
    });

    await expect(importFlowDialog.fileNameWrapper).toHaveText(
      'Selected file:abcd.json'
    );
    await importFlowDialog.importButton.click();
    await expect(importFlowDialog.genericImportError).toHaveText(
      'Something went wrong. Please try again.'
    );
  });
});
