import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
  });

  const url = `https://login.mailchimp.com/oauth2/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
