import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const response = await $.http.post(
    `${$.app.baseUrl}/login/oauth/access_token`,
    {
      client_id: $.auth.data.consumerKey,
      client_secret: $.auth.data.consumerSecret,
      code: $.auth.data.code,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  const data = response.data;

  $.auth.data.accessToken = data.access_token;

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    consumerKey: $.auth.data.consumerKey,
    consumerSecret: $.auth.data.consumerSecret,
    accessToken: data.access_token,
    scope: data.scope,
    tokenType: data.token_type,
    userId: currentUser.id,
    screenName: currentUser.login,
  });
};

export default verifyCredentials;
