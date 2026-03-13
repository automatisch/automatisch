const verifyCredentials = async ($) => {
  await $.http.get('/apis/list-voices');
};

export default verifyCredentials;
