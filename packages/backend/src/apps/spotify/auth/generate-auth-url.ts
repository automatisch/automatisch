import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import scopes from '../common/scopes';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const state = Math.random().toString() as string;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    grant_type: 'client_credentials',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(','),
    state: state,
  });

  const url = `https://accounts.spotify.com/authorize?${searchParams}`;

  await $.auth.set({
    url,
  });
}
