import { OAUTH_ENDPOINTS } from '../common/constants';
import { getFrappeSiteURL, getOAuthRedirectUrl } from '../common/utils';

export default async function generateAuthUrl($) {
  const redirectUri = getOAuthRedirectUrl($);
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: "all openid",
    response_type: 'code',
  });

  const url = `${getFrappeSiteURL($)}${OAUTH_ENDPOINTS.AUTHORIZE}?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
