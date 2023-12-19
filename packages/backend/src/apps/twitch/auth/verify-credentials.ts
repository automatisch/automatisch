import { IField, IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const userParams = {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };

  const { data } = await $.http.post(
    `https://id.twitch.tv/oauth2/token`,
    null,
    { headers, params: userParams }
  );

  await $.auth.set({
    userAccessToken: data.access_token,
  });

  const currentUser = await getCurrentUser($);

  const screenName = [currentUser.display_name, currentUser.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    userExpiresIn: data.expires_in,
    userRefreshToken: data.refresh_token,
    screenName,
  });

  const appParams = {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    grant_type: 'client_credentials',
  };

  const response = await $.http.post(
    `https://id.twitch.tv/oauth2/token`,
    null,
    { headers, params: appParams }
  );

  await $.auth.set({
    appAccessToken: response.data.access_token,
    appExpiresIn: response.data.expires_in,
  });
};

export default verifyCredentials;
