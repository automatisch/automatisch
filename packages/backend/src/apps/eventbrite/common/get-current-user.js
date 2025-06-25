const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/v3/users/me');
  return currentUser;
};

export default getCurrentUser;
