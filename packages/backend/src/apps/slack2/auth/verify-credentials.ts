import qs from 'qs';

const verifyCredentials = async ($: any) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const stringifiedBody = qs.stringify({
    token: $.auth.accessToken,
  });

  const response = await $.http.post('/auth.test', stringifiedBody, {
    headers,
  });

  if (response.data.ok === false) {
    throw new Error(
      `Error occured while verifying credentials: ${response.data.error}.(More info: https://api.slack.com/methods/auth.test#errors)`
    );
  }

  const { bot_id: botId, user: screenName } = response.data;

  $.auth.set({
    botId,
    screenName,
    token: $.auth.accessToken,
  });

  return response.data;
};

export default verifyCredentials;
