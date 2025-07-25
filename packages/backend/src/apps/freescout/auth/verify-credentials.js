const verifyCredentials = async ($) => {
  await $.http.get('/mailboxes');
};

export default verifyCredentials;
