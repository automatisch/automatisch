import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    return_url: redirectUri,
    scope: authScope.join(','),
    expiration: 'never',
    key: $.auth.data.apiKey,
    response_type: 'token',
  });

  const url = `https://trello.com/1/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
