const isStillVerified = async ($) => {
  await $.http.get('/me');

  return true;
};

export default isStillVerified;
