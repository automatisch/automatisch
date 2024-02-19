import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    scope: authScope.join(','),
    client_id: $.auth.data.clientId,
    response_type: 'code',
    access_type: 'offline',
    redirect_uri: redirectUri,
  });

  const domain =
    $.auth.data.region !== 'cn' ? 'account.zoho.com' : 'accounts.zoho.com.cn';

  const url = `https://${domain}/oauth/v2/auth?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
