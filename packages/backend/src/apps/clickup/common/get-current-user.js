const getCurrentUser = async ($) => {
  const { data } = await $.http.get('/v2/user');
  return data.user;
};

export default getCurrentUser;
