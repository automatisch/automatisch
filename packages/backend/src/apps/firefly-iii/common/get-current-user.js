const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get('/api/v1/about/user', {
    Headers: {
      Accept: 'application/vnd.api+json',
    },
  });
  return currentUser.data;
};

export default getCurrentUser;
