const isStillVerified = async ($) => {
  await $.http.get('/api/mailboxes');
  return true;
};

export default isStillVerified;
