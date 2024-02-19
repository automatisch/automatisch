import { URLSearchParams } from 'node:url';

import authScope from '../common/auth-scope.js';
import { regionUrlMap } from '../common/region-url-map.js';

const refreshToken = async ($) => {
  const location = $.auth.data.location;
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    refresh_token: $.auth.data.refreshToken,
    grant_type: 'refresh_token',
  });

  const { data } = await $.http.post(
    `${regionUrlMap[location]}/oauth/v2/token`,
    params.toString(),
    {
      additionalProperties: {
        skipAddingBaseUrl: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    apiDomain: data.api_domain,
    scope: authScope.join(','),
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  });
};

export default refreshToken;
