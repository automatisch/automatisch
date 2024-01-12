import { URLSearchParams } from 'url';
import scopes from '../common/scopes.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );

  const callbackUrl = oauthRedirectUrlField.value;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: callbackUrl,
    response_type: 'code',
    permissions: '2146958591',
    scope: scopes.join(' '),
  });

  const url = `${$.app.apiBaseUrl}/oauth2/authorize?${searchParams.toString()}`;

  await $.auth.set({ url });
}
