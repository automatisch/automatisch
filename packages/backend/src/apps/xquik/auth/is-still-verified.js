const isStillVerified = async ($) => {
  await $.http.get('/account');

  return true;
};

export default isStillVerified;
