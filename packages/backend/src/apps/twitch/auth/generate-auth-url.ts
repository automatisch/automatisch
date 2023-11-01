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
  });

  const url = `https://id.twitch.tv/oauth2/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
