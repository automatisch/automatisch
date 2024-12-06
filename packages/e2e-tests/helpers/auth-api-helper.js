const { expect } = require('../fixtures/index');

export const getToken = async (apiRequest) => {
  const tokenResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/api/v1/access-tokens`,
    {
      data: {
        email: process.env.LOGIN_EMAIL,
        password: process.env.LOGIN_PASSWORD,
      },
    }
  );
  await expect(tokenResponse.status()).toBe(200);

  return await tokenResponse.json();
};
