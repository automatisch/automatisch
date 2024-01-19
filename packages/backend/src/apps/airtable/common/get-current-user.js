const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/v0/meta/whoami');
  return currentUser;
};

export default getCurrentUser;
