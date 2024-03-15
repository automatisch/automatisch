const verifyCredentials = async ($) => {
  await $.http.get('/v1/users');
};

export default verifyCredentials;
