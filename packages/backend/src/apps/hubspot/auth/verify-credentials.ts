import { IGlobalVariable, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';
import getAccessTokenInfo from '../common/get-access-token-info';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const callbackUrl = oauthRedirectUrlField.value as string;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    redirect_uri: callbackUrl,
    code: $.auth.data.code as string,
  });

  const { data: verifiedCredentials } = await $.http.post(
    '/oauth/v1/token',
    params.toString()
  );

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
  } = verifiedCredentials;

  await $.auth.set({
    accessToken,
    refreshToken,
    expiresIn,
  });

  const accessTokenInfo = await getAccessTokenInfo($);

  await $.auth.set({
    screenName: accessTokenInfo.user,
    hubDomain: accessTokenInfo.hub_domain,
    scopes: accessTokenInfo.scopes,
    scopeToScopeGroupPks: accessTokenInfo.scope_to_scope_group_pks,
    trialScopes: accessTokenInfo.trial_scopes,
    trialScopeToScoreGroupPks: accessTokenInfo.trial_scope_to_scope_group_pks,
    hubId: accessTokenInfo.hub_id,
    appId: accessTokenInfo.app_id,
    userId: accessTokenInfo.user_id,
    expiresIn: accessTokenInfo.expires_in,
    tokenType: accessTokenInfo.token_type,
  });
};

export default verifyCredentials;
