const getCurrentUser = async ($) => {
  const response = await $.http.get('/users/@me');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
