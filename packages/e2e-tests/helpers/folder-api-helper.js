const { expect } = require('../fixtures/index');

export const addFolder = async (apiRequest, token, folderName) => {
  const addFolderResponse = await apiRequest.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/folders`,
    {
      headers: { Authorization: token },
      data: { name: folderName },
    }
  );
  await expect(addFolderResponse.status()).toBe(201);

  return await addFolderResponse.json();
};
