const isStillVerified = async ($) => {
  await $.http.get('/mailboxes');
  return true;
};

export default isStillVerified;
