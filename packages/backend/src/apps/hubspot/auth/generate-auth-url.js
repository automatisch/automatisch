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
    scope: scopes.join(' '),
  });

  const url = `https://app.hubspot.com/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({ url });
}
