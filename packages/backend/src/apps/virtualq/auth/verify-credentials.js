const verifyCredentials = async ($) => {
  const response = await $.http.get('/v2/call_centers');

  const callCenterNames = response.data.data
    .map((callCenter) => callCenter.attributes.name)
    .join(' - ');

  await $.auth.set({
    screenName: callCenterNames,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
