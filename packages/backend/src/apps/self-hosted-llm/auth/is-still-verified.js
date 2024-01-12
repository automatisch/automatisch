const isStillVerified = async ($) => {
  await $.http.get('/v1/models');
  return true;
};

export default isStillVerified;
