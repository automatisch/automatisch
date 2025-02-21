import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const state = Math.random().toString();
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: state,
  });

  const url = `${
    $.auth.data.instanceUrl
  }/login/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
    originalState: state,
  });
}
