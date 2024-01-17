const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/user');
  return currentUser.data.user.id;
};

export default getCurrentUser;
