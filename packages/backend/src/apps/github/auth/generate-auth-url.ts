import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const scopes = ['read:org', 'repo', 'user'];
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey as string,
    redirect_uri: redirectUri,
    scope: scopes.join(','),
  });

  const url = `${$.app.baseUrl
    }/login/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
