const verifyCredentials = async ($) => {
  await $.http.get('/v2/metadata');
};

export default verifyCredentials;
