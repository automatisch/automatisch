import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrl = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  ).value;

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: oauthRedirectUrl as string,
    scope: authScope.join(' '),
  });

  const url = `${$.app.apiBaseUrl}/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
