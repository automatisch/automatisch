const isStillVerified = async ($) => {
  await $.http.get('/fine_tuning/jobs');
  return true;
};

export default isStillVerified;
