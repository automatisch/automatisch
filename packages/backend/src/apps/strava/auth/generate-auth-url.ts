import { URLSearchParams } from 'node:url';
import { IField, IGlobalVariable } from '@automatisch/types';

export default async function createAuthData($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: redirectUri,
    approval_prompt: 'force',
    response_type: 'code',
    scope: 'read_all,profile:read_all,activity:read_all,activity:write',
  });

  await $.auth.set({
    url: `${$.app.baseUrl}/oauth/authorize?${searchParams}`,
  });
}
