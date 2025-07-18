const { expect } = require('../fixtures/index');

export const addTemplate = async (apiRequest, token, flowId, templateName) => {
  const addTemplateResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/admin/templates`,
    {
      headers: { Authorization: token },
      data: { flowId: flowId, name: templateName },
    }
  );
  await expect(addTemplateResponse.status()).toBe(201);

  return await addTemplateResponse.json();
};
