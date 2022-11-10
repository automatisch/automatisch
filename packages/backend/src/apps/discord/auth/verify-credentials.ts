import { IGlobalVariable, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';
import scopes from '../common/scopes';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const callbackUrl = oauthRedirectUrlField.value as string;
  const params = new URLSearchParams({
    client_id: $.auth.data.consumerKey as string,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: scopes.join(' '),
    client_secret: $.auth.data.consumerSecret as string,
    code: $.auth.data.code as string,
    grant_type: 'authorization_code',
  });
  const { data: verifiedCredentials } = await $.http.post(
    '/oauth2/token',
    params.toString()
  );

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    scope: scope,
    token_type: tokenType,
    guild: { id: guildId, name: guildName },
  } = verifiedCredentials;

  await $.auth.set({
    accessToken,
    refreshToken,
    expiresIn,
    scope,
    tokenType,
  });

  const user = await getCurrentUser($);

  await $.auth.set({
    userId: user.id,
    screenName: user.username,
    email: user.email,
    guildId,
    guildName,
  });
};

export default verifyCredentials;
