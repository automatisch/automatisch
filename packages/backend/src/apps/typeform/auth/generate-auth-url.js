import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrl = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  ).value;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: oauthRedirectUrl,
    scope: authScope.join(' '),
  });

  const url = `${$.app.apiBaseUrl}/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
