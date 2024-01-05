const getCurrentUser = async ($) => {
  const response = await $.http.get('/v3/athlete');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
