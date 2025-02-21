const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get(`/user`);
  return currentUser;
};

export default getCurrentUser;
