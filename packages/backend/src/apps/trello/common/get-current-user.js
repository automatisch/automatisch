const getCurrentUser = async ($) => {
  const response = await $.http.get('/1/members/me/');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
