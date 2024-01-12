const getCurrentUser = async ($) => {
  const response = await $.http.get(`${$.auth.data.apiDomain}/api/v1/users/me`);
  const currentUser = response.data.data;

  return currentUser;
};

export default getCurrentUser;
