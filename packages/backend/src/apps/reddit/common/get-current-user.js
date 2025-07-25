const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/v1/me');
  return currentUser;
};

export default getCurrentUser;
