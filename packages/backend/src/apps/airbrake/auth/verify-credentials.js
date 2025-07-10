const verifyCredentials = async ($) => {
  await $.http.get('/api/v4/projects');
};

export default verifyCredentials;
