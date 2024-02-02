import { URLSearchParams } from 'node:url';

export default async function createAuthData($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    approval_prompt: 'force',
    response_type: 'code',
    scope: 'read_all,profile:read_all,activity:read_all,activity:write',
  });

  await $.auth.set({
    url: `${$.app.baseUrl}/oauth/authorize?${searchParams}`,
  });
}
