const getCurrentUser = async ($) => {
  const response = await $.http.get('/api/v2/users/me');
  const currentUser = response.data.user;

  return currentUser;
};

export default getCurrentUser;
