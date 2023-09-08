import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import scopes from '../common/scopes';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const callbackUrl = oauthRedirectUrlField.value as string;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: callbackUrl,
    scope: scopes.join(' '),
  });

  const url = `https://app.hubspot.com/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({ url });
}
