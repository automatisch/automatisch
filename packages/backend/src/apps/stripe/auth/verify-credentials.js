const verifyCredentials = async ($) => {
  await $.http.get(`/v1/events`);
  await $.auth.set({
    screenName: $.auth.data?.displayName,
  });
};

export default verifyCredentials;
