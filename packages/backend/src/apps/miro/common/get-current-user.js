const getCurrentUser = async ($) => {
  const { data } = await $.http.get(
    `https://api.miro.com/v1/oauth-token?access_token=${$.auth.data.accessToken}`
  );
  return data.user;
};

export default getCurrentUser;
