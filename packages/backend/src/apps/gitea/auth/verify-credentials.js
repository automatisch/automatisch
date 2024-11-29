import getCurrentUser from '../common/get-current-user.js';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($) => {
  if ($.auth.data.originalState !== $.auth.data.state) {
    throw new Error(`The 'state' parameter does not match.`);
  }
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const { data } = await $.http.post(
    `${$.auth.data.instanceUrl}/login/oauth/access_token`,
    params.toString(),
    {
      additionalProperties: {
        skipAddingBaseUrl: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);
  const screenName = [currentUser.username, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    repoOwner: currentUser.username,
    screenName,
  });
};

export default verifyCredentials;
