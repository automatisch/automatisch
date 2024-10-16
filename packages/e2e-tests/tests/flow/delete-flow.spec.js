const { test, expect } = require('../../fixtures/index');
const { expectNoDelayedJobForFlow } = require('../../helpers/bullmq-helper');
const {
  createFlow,
  updateFlowName,
  updateFlowStep,
  testStep,
  publishFlow,
} = require('../../helpers/flow-api-helper');

let tokenJsonResponse;

test.beforeAll(async ({ request }) => {
  const tokenResponse = await request.post(
    `http://localhost:${process.env.PORT}/api/v1/access-tokens`,
    {
      data: {
        email: process.env.LOGIN_EMAIL,
        password: process.env.LOGIN_PASSWORD,
      },
    }
  );
  await expect(tokenResponse.status()).toBe(200);
  tokenJsonResponse = await tokenResponse.json();
});

test('Empty flow can be deleted', async ({ page, request, flowsPage }) => {
  const flow = await createFlow(request, tokenJsonResponse.data.token);
  const flowId = flow.data.id;
  await updateFlowName(request, tokenJsonResponse.data.token, flowId);

  await page.reload();

  await flowsPage.deleteFlow(flowId);
});

test('Completed webhook flow can be deleted', async ({
  page,
  request,
  flowsPage,
}) => {
  const flow = await createFlow(request, tokenJsonResponse.data.token);
  const flowId = flow.data.id;
  const flowSteps = flow.data.steps;
  await updateFlowName(request, tokenJsonResponse.data.token, flowId);

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  const triggerStep = await updateFlowStep(
    request,
    tokenJsonResponse.data.token,
    triggerStepId,
    {
      appKey: 'webhook',
      key: 'catchRawWebhook',
      parameters: {
        workSynchronously: false,
      },
    }
  );
  await testStep(request, tokenJsonResponse.data.token, triggerStepId);

  await updateFlowStep(request, tokenJsonResponse.data.token, actionStepId, {
    appKey: 'webhook',
    key: 'respondWith',
    parameters: {
      statusCode: '200',
      body: 'ok',
      headers: [
        {
          key: '',
          value: '',
        },
      ],
    },
  });
  await testStep(request, tokenJsonResponse.data.token, actionStepId);

  await page.reload();

  await flowsPage.deleteFlow(flowId);
  const triggerWebhookResponse = await request.get(triggerStep.data.webhookUrl);
  await expect(triggerWebhookResponse.status()).toBe(404);
});

test('Completed poll flow can be deleted', async ({
  page,
  request,
  flowsPage,
}) => {
  const flow = await createFlow(request, tokenJsonResponse.data.token);
  const flowId = flow.data.id;
  const flowSteps = flow.data.steps;
  await updateFlowName(request, tokenJsonResponse.data.token, flowId);

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  await updateFlowStep(request, tokenJsonResponse.data.token, triggerStepId, {
    appKey: 'rss',
    key: 'newItemsInFeed',
    parameters: { feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
  });
  await testStep(request, tokenJsonResponse.data.token, triggerStepId);

  await updateFlowStep(request, tokenJsonResponse.data.token, actionStepId, {
    appKey: 'datastore',
    key: 'setValue',
    parameters: {
      key: 'newsTitle',
      value: '{{step.' + triggerStepId + '.title}}',
    },
  });
  await testStep(request, tokenJsonResponse.data.token, actionStepId);

  await page.reload();

  await flowsPage.deleteFlow(flowId);

  await expectNoDelayedJobForFlow(request, flowId);
});

test('Published webhook flow can be deleted', async ({
  page,
  request,
  flowsPage,
}) => {
  const flow = await createFlow(request, tokenJsonResponse.data.token);
  const flowId = flow.data.id;
  const flowSteps = flow.data.steps;
  await updateFlowName(request, tokenJsonResponse.data.token, flowId);

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  const triggerStep = await updateFlowStep(
    request,
    tokenJsonResponse.data.token,
    triggerStepId,
    {
      appKey: 'webhook',
      key: 'catchRawWebhook',
      parameters: {
        workSynchronously: false,
      },
    }
  );
  await testStep(request, tokenJsonResponse.data.token, triggerStepId);

  await updateFlowStep(request, tokenJsonResponse.data.token, actionStepId, {
    appKey: 'webhook',
    key: 'respondWith',
    parameters: {
      statusCode: '200',
      body: 'ok',
      headers: [
        {
          key: '',
          value: '',
        },
      ],
    },
  });
  await testStep(request, tokenJsonResponse.data.token, actionStepId);

  await publishFlow(request, tokenJsonResponse.data.token, flowId);

  await page.reload();

  await flowsPage.deleteFlow(flowId);
  const triggerWebhookResponse = await request.get(triggerStep.data.webhookUrl);
  await expect(triggerWebhookResponse.status()).toBe(404);
});

test('Published poll flow can be deleted', async ({
  page,
  request,
  flowsPage,
}) => {
  const flow = await createFlow(request, tokenJsonResponse.data.token);
  const flowId = flow.data.id;
  const flowSteps = flow.data.steps;
  await updateFlowName(request, tokenJsonResponse.data.token, flowId);

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  await updateFlowStep(request, tokenJsonResponse.data.token, triggerStepId, {
    appKey: 'rss',
    key: 'newItemsInFeed',
    parameters: { feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
  });
  await testStep(request, tokenJsonResponse.data.token, triggerStepId);

  await updateFlowStep(request, tokenJsonResponse.data.token, actionStepId, {
    appKey: 'datastore',
    key: 'setValue',
    parameters: {
      key: 'newsTitle',
      value: '{{step.' + triggerStepId + '.title}}',
    },
  });
  await testStep(request, tokenJsonResponse.data.token, actionStepId);

  await publishFlow(request, tokenJsonResponse.data.token, flowId);

  await page.reload();

  await flowsPage.deleteFlow(flowId);

  await expectNoDelayedJobForFlow(request, flowId);
});
