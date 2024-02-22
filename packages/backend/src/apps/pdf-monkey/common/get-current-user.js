const getCurrentUser = async ($) => {
  const response = await $.http.get('/v1/current_user');
  const currentUser = response.data.current_user;

  return currentUser;
};

export default getCurrentUser;
