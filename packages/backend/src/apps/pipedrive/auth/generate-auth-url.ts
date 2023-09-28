import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: redirectUri,
  });

  const url = `https://oauth.pipedrive.com/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
