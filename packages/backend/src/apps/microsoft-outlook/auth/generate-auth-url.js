import {URLSearchParams} from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    prompt: 'select_account',
    scope: authScope.join(' '),
    response_type: 'code',
  });

  const url = `https://login.microsoftonline.com/${$.auth.data.tenantId}/oauth2/v2.0/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
