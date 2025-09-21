const getCurrentUser = async ($) => {
  const response = await $.http.get('/rest/v1/user', {
    headers: {
      Authorization: `Bearer ${$.auth.data.accessToken}`,
    },
  });

  return response.data;
};

export default getCurrentUser;
