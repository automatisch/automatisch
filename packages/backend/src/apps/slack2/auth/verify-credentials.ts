import qs from 'qs';
import { IGlobalVariableForConnection } from '../../../helpers/global-variable/connection';

const verifyCredentials = async ($: IGlobalVariableForConnection) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const stringifiedBody = qs.stringify({
    token: $.auth.data.accessToken,
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
    token: $.auth.data.accessToken,
  });

  return response.data;
};

export default verifyCredentials;
