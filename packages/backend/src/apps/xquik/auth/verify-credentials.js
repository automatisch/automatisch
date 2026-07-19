const verifyCredentials = async ($) => {
  await $.http.get('/account');

  return true;
};

export default verifyCredentials;
