const getCurrentUser = async ($) => {
  const response = await $.http.get('/rest/v1/user');

  return response.data;
};

export default getCurrentUser;
