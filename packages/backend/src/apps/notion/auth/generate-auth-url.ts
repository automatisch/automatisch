import { IField, IGlobalVariable } from '@automatisch/types';
import { URL, URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: redirectUri,
    response_type: 'code',
    owner: 'user',
  });

  const url = new URL(`/v1/oauth/authorize?${searchParams}`, $.app.apiBaseUrl).toString();

  await $.auth.set({
    url,
  });
}
