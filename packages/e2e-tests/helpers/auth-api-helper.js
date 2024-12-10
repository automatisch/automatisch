const { expect } = require('../fixtures/index');

export const getToken = async (apiRequest) => {
  const tokenResponse = await apiRequest.post(
    `http://localhost:${process.env.PORT}/api/v1/access-tokens`,
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
