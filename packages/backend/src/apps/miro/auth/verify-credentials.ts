import { IField, IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = {
    grant_type: 'authorization_code',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    redirect_uri: redirectUri,
  };

  const { data } = await $.http.post(`/v1/oauth/token`, null, {
    params,
  });

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    userId: data.user_id,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    teamId: data.team_id,
    scope: data.scope,
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    screenName: currentUser.name,
  });
};

export default verifyCredentials;
