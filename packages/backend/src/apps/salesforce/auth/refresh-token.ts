import { IGlobalVariable } from '@automatisch/types';
import qs from 'querystring';

const refreshToken = async ($: IGlobalVariable) => {
  const searchParams = qs.stringify({
    grant_type: 'refresh_token',
    client_id: $.auth.data.consumerKey as string,
    client_secret: $.auth.data.consumerSecret as string,
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post(
    `${$.auth.data.oauth2Url}/token?${searchParams}`
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    idToken: data.id_token,
    instanceUrl: data.instance_url,
    signature: data.signature,
  });
};

export default refreshToken;
