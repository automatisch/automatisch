import { URLSearchParams } from 'url';
import scopes from '../common/scopes.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const state = Math.random().toString();

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    grant_type: 'client_credentials',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: state,
  });

  const url = `https://accounts.spotify.com/authorize?${searchParams}`;

  await $.auth.set({
    url,
  });
}
