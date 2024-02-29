import { URLSearchParams } from 'node:url';
import { regionUrlMap } from '../common/region-url-map.js';
import getCurrentOrganization from '../common/get-current-organization.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const location = $.auth.data.location;
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const { data } = await $.http.post(
    `${regionUrlMap[location]}/oauth/v2/token`,
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    apiDomain: data.api_domain,
  });

  const organization = await getCurrentOrganization($);

  const screenName = [organization.company_name, organization.primary_email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    screenName,
  });
};

export default verifyCredentials;
