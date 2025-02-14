import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oAuthRedirectUrl = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oAuthRedirectUrl.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    scope: authScope.join(' '),
    response_type: 'code',
  });

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
