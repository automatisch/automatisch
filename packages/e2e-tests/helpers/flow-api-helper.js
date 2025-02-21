const { expect } = require('../fixtures/index');

export const createFlow = async (request, token) => {
  const response = await request.post(
    `${process.env.BACKEND_APP_URL}/api/v1/flows`,
    { headers: { Authorization: token } }
  );
  await expect(response.status()).toBe(201);
  return await response.json();
};

export const getFlow = async (request, token, flowId) => {
  const response = await request.get(
    `${process.env.BACKEND_APP_URL}/api/v1/flows/${flowId}`,
    { headers: { Authorization: token } }
  );
  await expect(response.status()).toBe(200);
  return await response.json();
};

export const updateFlowName = async (request, token, flowId) => {
  const updateFlowNameResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/api/v1/flows/${flowId}`,
    {
      headers: { Authorization: token },
      data: { name: flowId },
    }
  );
  await expect(updateFlowNameResponse.status()).toBe(200);
};

export const updateFlowStep = async (request, token, stepId, requestBody) => {
  const updateTriggerStepResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/api/v1/steps/${stepId}`,
    {
      headers: { Authorization: token },
      data: requestBody,
    }
  );
  await expect(updateTriggerStepResponse.status()).toBe(200);
  return await updateTriggerStepResponse.json();
};

export const testStep = async (request, token, stepId) => {
  const testTriggerStepResponse = await request.post(
    `${process.env.BACKEND_APP_URL}/api/v1/steps/${stepId}/test`,
    {
      headers: { Authorization: token },
    }
  );
  await expect(testTriggerStepResponse.status()).toBe(200);
};

export const publishFlow = async (request, token, flowId) => {
  const publishFlowResponse = await request.patch(
    `${process.env.BACKEND_APP_URL}/api/v1/flows/${flowId}/status`,
    {
      headers: { Authorization: token },
      data: { active: true },
    }
  );
  await expect(publishFlowResponse.status()).toBe(200);
  return publishFlowResponse.json();
};

export const triggerFlow = async (request, url) => {
  const triggerFlowResponse = await request.get(url);
  await expect(triggerFlowResponse.status()).toBe(204);
};
