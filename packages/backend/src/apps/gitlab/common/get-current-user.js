const getCurrentUser = async ($) => {
  // ref: https://docs.gitlab.com/ee/api/users.html#list-current-user

  const response = await $.http.get('/api/v4/user');
  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
