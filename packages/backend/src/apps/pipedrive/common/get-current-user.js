const getCurrentUser = async ($) => {
  const response = await $.http.get('/v1/users/me');
  const currentUser = response.data.data;

  return currentUser;
};

export default getCurrentUser;
