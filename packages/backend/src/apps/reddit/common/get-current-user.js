const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/api/v1/me');
  return currentUser;
};

export default getCurrentUser;
