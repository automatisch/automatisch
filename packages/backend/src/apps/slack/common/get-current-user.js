const getCurrentUser = async ($) => {
  const params = {
    user: $.auth.data.userId,
  };
  const response = await $.http.get('/users.info', { params });
  const currentUser = response.data.user;

  return currentUser;
};

export default getCurrentUser;
