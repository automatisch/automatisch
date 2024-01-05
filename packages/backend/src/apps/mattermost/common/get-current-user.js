const getCurrentUser = async ($) => {
  const response = await $.http.get('/api/v4/users/me');
  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
