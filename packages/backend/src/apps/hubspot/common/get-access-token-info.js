const getAccessTokenInfo = async ($) => {
  const response = await $.http.get(
    `/oauth/v1/access-tokens/${$.auth.data.accessToken}`
  );

  return response.data;
};

export default getAccessTokenInfo;
