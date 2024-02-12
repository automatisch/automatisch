const verifyCredentials = async ($) => {
  await $.http.get(`/api/v4/projects?key=${$.auth.data.authToken}`, {
    additionalProperties: {
      skipAddingAuthToken: true,
    },
  });

  await $.auth.set({
    screenName: $.auth.data.screenName,
    authToken: $.auth.data.authToken,
  });
};

export default verifyCredentials;
