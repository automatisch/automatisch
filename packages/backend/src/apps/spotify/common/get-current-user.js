const getCurrentUser = async ($) => {
  const response = await $.http.get('/v1/me');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
