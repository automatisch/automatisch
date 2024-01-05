import { URLSearchParams } from 'url';
import scopes from '../common/scopes.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );

  const callbackUrl = oauthRedirectUrlField.value;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: scopes.join(' '),
    token_access_type: 'offline',
  });

  const url = `${$.app.baseUrl}/oauth2/authorize?${searchParams.toString()}`;

  await $.auth.set({ url });
}
