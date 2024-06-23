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

  // curl --request POST --url 'https://www.eventbrite.com/oauth/token' --header 'content-type: application/x-www-form-urlencoded' --data grant_type=authorization_code --data 'client_id=API_KEY --data client_secret=CLIENT_SECRET --data code=ACCESS_CODE --data 'redirect_uri=REDIRECT_URI'

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    `https://www.eventbrite.com/oauth/token`,
    params.toString(),
    { headers }
  );

  const { access_token: accessToken, token_type: tokenType } = response.data;

  await $.auth.set({
    accessToken,
    tokenType,
  });

  const user = await getCurrentUser($);

  await $.auth.set({
    userId: user.id,
    screenName: user.name,
  });
};

export default verifyCredentials;
