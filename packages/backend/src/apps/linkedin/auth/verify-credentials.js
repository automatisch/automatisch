import getCurrentUser from '../common/get-current-user.js';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const params = new URLSearchParams({
    code: $.auth.data.code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    `${$.app.baseUrl}/oauth/v2/accessToken`,
    params.toString(),
    { headers }
  );

  const { access_token: accessToken, expires_in: expiresIn } = response.data;

  await $.auth.set({
    accessToken,
    expiresIn,
  });

  const user = await getCurrentUser($);

  await $.auth.set({
    userId: user.sub,
    screenName: user.name,
  });
};

export default verifyCredentials;
