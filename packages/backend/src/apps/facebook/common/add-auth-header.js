const addAuthHeader = async (request, authData) => {
  const { accessToken } = authData;

  if (!request.params) {
    request.params = {};
  }

  request.params.access_token = accessToken;

  return request;
};

export default addAuthHeader; 