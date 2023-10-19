import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: authScope.join(' '),
    access_type: 'offline',
    prompt: 'select_account',
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
