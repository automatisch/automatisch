const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/v1/about/user', {
    headers: {
      accept: 'application/vnd.api+json',
    },
  });

  return currentUser.data;
};

export default getCurrentUser;
