const getCurrentUser = async ($) => {
  const response = await $.http.get('/user');

  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
