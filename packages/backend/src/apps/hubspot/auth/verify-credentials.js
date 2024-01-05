import { URLSearchParams } from 'url';
import getAccessTokenInfo from '../common/get-access-token-info.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const callbackUrl = oauthRedirectUrlField.value;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    redirect_uri: callbackUrl,
    code: $.auth.data.code,
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
