const isStillVerified = async ($) => {
  await $.http.get('/apis/list-voices');

  return true;
};

export default isStillVerified;
