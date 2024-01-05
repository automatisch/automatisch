const verifyCredentials = async ($) => {
  await $.http.get('/fine_tuning/jobs');
};

export default verifyCredentials;
