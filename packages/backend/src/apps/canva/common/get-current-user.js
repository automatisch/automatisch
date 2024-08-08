const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/rest/v1/users/me/profile');
  return currentUser;
};

export default getCurrentUser;
