const { expect } = require('../fixtures/index');

export const addUser = async (apiRequest, token, request) => {
  const addUserResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/admin/users`,
    {
      headers: { Authorization: token },
      data: request,
    }
  );
  await expect(addUserResponse.status()).toBe(201);

  return await addUserResponse.json();
};

export const acceptInvitation = async (apiRequest, request) => {
  const acceptInvitationResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/users/invitation`,
    {
      data: request,
    }
  );
  await expect(acceptInvitationResponse.status()).toBe(204);
};
