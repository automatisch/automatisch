const isStillVerified = async ($) => {
  const r = await $.http.get('/v1/models');
  return true;
};

export default isStillVerified;
