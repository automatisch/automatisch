import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email w_member_social',
  });

  const url = `${$.app.baseUrl}/oauth/v2/authorization?${searchParams}`;

  await $.auth.set({
    url,
  });
}
