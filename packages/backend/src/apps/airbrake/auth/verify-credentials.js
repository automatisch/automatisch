const verifyCredentials = async ($) => {
  await $.http.get('/v4/projects');
};

export default verifyCredentials;
