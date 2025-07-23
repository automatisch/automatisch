const verifyCredentials = async ($) => {
  const body = {
    q: 'Hi!',
  };

  await $.http.post('/detect', body);
};

export default verifyCredentials;
