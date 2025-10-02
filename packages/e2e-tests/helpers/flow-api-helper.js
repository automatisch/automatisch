import { expect } from '../fixtures/index';

export const createFlow = async (request, token) => {
  const response = await request.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/flows`,
    { headers: { Authorization: token } }
  );
  expect(response.status()).toBe(201);

  return await response.json();
};

export const getFlow = async (request, token, flowId) => {
  const response = await request.get(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/flows/${flowId}`,
    { headers: { Authorization: token } }
  );
  expect(response.status()).toBe(200);

  return await response.json();
};

export const updateFlowName = async (request, token, flowId) => {
  const updateFlowNameResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/flows/${flowId}`,
    {
      headers: { Authorization: token },
      data: { name: flowId },
    }
  );
  expect(updateFlowNameResponse.status()).toBe(200);
};

export const updateFlowStep = async (request, token, stepId, requestBody) => {
  const updateTriggerStepResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/steps/${stepId}`,
    {
      headers: { Authorization: token },
      data: requestBody,
    }
  );
  expect(updateTriggerStepResponse.status()).toBe(200);

  return await updateTriggerStepResponse.json();
};

export const testStep = async (request, token, stepId) => {
  const testTriggerStepResponse = await request.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/steps/${stepId}/test-and-continue`,
    {
      headers: { Authorization: token },
    }
  );
  expect(testTriggerStepResponse.status()).toBe(200);
};

export const publishFlow = async (request, token, flowId) => {
  const publishFlowResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/flows/${flowId}/status`,
    {
      headers: { Authorization: token },
      data: { active: true },
    }
  );
  expect(publishFlowResponse.status()).toBe(200);

  return publishFlowResponse.json();
};

export const triggerFlow = async (request, url) => {
  const triggerFlowResponse = await request.get(url);
  expect(triggerFlowResponse.status()).toBe(204);
};

export const addWebhookFlow = async (request, token) => {
  let flow = await createFlow(request, token);
  const flowId = flow.data.id;
  await updateFlowName(request, token, flowId);
  flow = await getFlow(request, token, flowId);
  const flowSteps = flow.data.steps;

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  const triggerStep = await updateFlowStep(request, token, triggerStepId, {
    appKey: 'webhook',
    key: 'catchRawWebhook',
    name: 'Webhook',
    parameters: {
      workSynchronously: false,
    },
  });
  await request.get(triggerStep.data.webhookUrl);
  await testStep(request, token, triggerStepId);

  await updateFlowStep(request, token, actionStepId, {
    appKey: 'webhook',
    key: 'respondWith',
    name: 'Webhook',
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
  await testStep(request, token, actionStepId);

  return flowId;
};

export const addFormsFlow = async (request, token, formId) => {
  let flow = await createFlow(request, token);
  const flowId = flow.data.id;
  await updateFlowName(request, token, flowId);
  flow = await getFlow(request, token, flowId);
  const flowSteps = flow.data.steps;

  const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
  const actionStepId = flowSteps.find((step) => step.type === 'action').id;

  await updateFlowStep(request, token, triggerStepId, {
    appKey: 'forms',
    key: 'newFormSubmission',
    name: 'New form submission',
    parameters: {
      formId: formId,
      workSynchronously: false,
      asyncRedirectUrl: '',
    },
  });
  await testStep(request, token, triggerStepId);

  await updateFlowStep(request, token, actionStepId, {
    appKey: 'webhook',
    key: 'respondWith',
    name: 'Webhook',
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
  await testStep(request, token, actionStepId);

  return flowId;
};

export const createConnection = async (
  request,
  token,
  appName,
  requestBody
) => {
  const response = await request.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/apps/${appName}/connections`,
    { headers: { Authorization: token }, data: requestBody }
  );
  expect(response.status()).toBe(201);

  return await response.json();
};

export const verifyConnection = async (request, token, connectionId) => {
  const response = await request.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/connections/${connectionId}/verify`,
    { headers: { Authorization: token } }
  );
  expect(response.status()).toBe(200);

  return await response.json();
};
