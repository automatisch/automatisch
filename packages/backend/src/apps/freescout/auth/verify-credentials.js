const verifyCredentials = async ($) => {
  await $.http.get(`${$.auth.data.instanceUrl}/api/mailboxes`);
};

export default verifyCredentials;
