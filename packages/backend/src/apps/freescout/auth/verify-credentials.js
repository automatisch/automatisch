const verifyCredentials = async ($) => {
  await $.http.get('/api/mailboxes');
};

export default verifyCredentials;
