const isStillVerified = async ($) => {
  await $.http.get('/projects');
  return true;
};

export default isStillVerified;
