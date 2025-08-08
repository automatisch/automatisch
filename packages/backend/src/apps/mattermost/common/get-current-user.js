const getCurrentUser = async ($) => {
  const response = await $.http.get('/v4/users/me');
  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
