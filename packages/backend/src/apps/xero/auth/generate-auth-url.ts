import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: $.auth.data.clientId as string,
    scope: authScope.join(' '),
    redirect_uri: redirectUri,
  });

  const url = `https://login.xero.com/identity/connect/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
