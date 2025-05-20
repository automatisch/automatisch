const { expect } = require('../fixtures/index');

export const getToken = async (
  apiRequest,
  email = process.env.LOGIN_EMAIL,
  password = process.env.LOGIN_PASSWORD
) => {
  const tokenResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/access-tokens`,
    {
      data: {
        email: email,
        password: password,
      },
    }
  );
  await expect(tokenResponse.status()).toBe(200);

  return await tokenResponse.json();
};
