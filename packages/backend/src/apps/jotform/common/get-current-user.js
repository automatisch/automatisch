const getCurrentUser = async ($) => {
  const response = await $.http.get('/user');
  const currentUser = response.data.content;
  return currentUser;
};

export default getCurrentUser;
