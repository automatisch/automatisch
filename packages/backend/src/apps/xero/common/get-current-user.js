const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/connections');
  return currentUser[0];
};

export default getCurrentUser;
