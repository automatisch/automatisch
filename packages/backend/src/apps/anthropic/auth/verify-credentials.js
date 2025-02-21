const verifyCredentials = async ($) => {
  await $.http.get('/v1/models');
};

export default verifyCredentials;
