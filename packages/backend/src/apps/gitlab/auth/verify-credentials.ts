import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  // ref: https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow

  const response = await $.http.post(
    `${$.auth.data.oInstanceUrl}/oauth/token`,
    {
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
      redirect_uri: $.auth.data.oAuthRedirectUrl,
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
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
    userId: currentUser.id,
    screenName: currentUser.username,
  });
};

export default verifyCredentials;
