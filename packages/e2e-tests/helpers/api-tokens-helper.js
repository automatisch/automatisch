const { expect } = require('../fixtures/index');

export const getApiTokens = async (apiRequest, token) => {
  const getApiTokensResponse = await apiRequest.get(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/admin/api-tokens`,
    {
      headers: { Authorization: token },
    }
  );
  expect(getApiTokensResponse.status()).toBe(200);

  return await getApiTokensResponse.json();
};

export const removeApiToken = async (apiRequest, token, tokenId) => {
  const addUserResponse = await apiRequest.delete(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/admin/api-tokens/${tokenId}`,
    {
      headers: { Authorization: token },
    }
  );
  expect(addUserResponse.status()).toBe(204);
};
