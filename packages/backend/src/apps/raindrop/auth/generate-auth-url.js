import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const scopes = ['read', 'write'];
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    response_type: 'code',
  });

  const url = `https://raindrop.io/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
