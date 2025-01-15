const isStillVerified = async ($) => {
  await $.http.get(`${$.auth.data.instanceUrl}/api/mailboxes`);
  return true;
};

export default isStillVerified;
