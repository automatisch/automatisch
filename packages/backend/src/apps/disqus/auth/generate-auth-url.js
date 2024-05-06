import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.apiKey,
    scope: authScope.join(','),
    response_type: 'code',
    redirect_uri: redirectUri,
  });

  const url = `https://disqus.com/api/oauth/2.0/authorize/?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
