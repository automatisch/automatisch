import { OAUTH_ENDPOINTS } from '../common/constants.js';
import { getOAuthRedirectUrl } from '../common/utils.js';

export default async function generateAuthUrl($) {
  const redirectUri = getOAuthRedirectUrl($);
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: 'all openid',
    response_type: 'code',
  });

  const url = `${$.auth.data.site_url}/api/v2${
    OAUTH_ENDPOINTS.AUTHORIZE
  }?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
