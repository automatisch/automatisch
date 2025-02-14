import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const webUrl = $.app.auth.fields.find((field) => field.key == 'webUrl');
  const redirectUri = webUrl.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    scope: authScope.join(' '),
    response_type: 'token',
    grant_type: 'refresh_token',
  });

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
