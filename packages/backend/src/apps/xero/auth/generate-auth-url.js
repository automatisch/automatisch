import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: $.auth.data.clientId,
    scope: authScope.join(' '),
    redirect_uri: redirectUri,
  });

  const url = `https://login.xero.com/identity/connect/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
