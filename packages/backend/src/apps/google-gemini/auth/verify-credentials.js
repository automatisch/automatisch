const verifyCredentials = async ($) => {
  await $.http.get('/models?key=' + $.auth.data.apiKey);

  let screenName = "Gemini API";

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
