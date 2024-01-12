const getCurrentUser = async ($) => {
  const userId = $.auth.data.owner.user.id;
  const response = await $.http.get(`/v1/users/${userId}`);

  const currentUser = response.data;
  return currentUser;
};

export default getCurrentUser;
