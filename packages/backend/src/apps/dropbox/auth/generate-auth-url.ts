import { URLSearchParams } from 'url';
import { IField, IGlobalVariable } from '@automatisch/types';
import scopes from '../common/scopes';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const callbackUrl = oauthRedirectUrlField.value as string;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: scopes.join(' '),
    token_access_type: 'offline',
  });

  const url = `${$.app.baseUrl}/oauth2/authorize?${searchParams.toString()}`;

  await $.auth.set({ url });
}
