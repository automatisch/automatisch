const getCurrentUser = async ($) => {
  const response = await $.http.get('/userinfo');
  const currentUser = response.data;

  return currentUser;
};

export default getCurrentUser;
