import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    return_url: redirectUri,
    scope: authScope.join(','),
    expiration: 'never',
    key: $.auth.data.apiKey as string,
    response_type: 'token',
  });

  const url = `https://trello.com/1/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
