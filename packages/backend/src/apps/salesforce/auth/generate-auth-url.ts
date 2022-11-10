import { IField, IGlobalVariable } from '@automatisch/types';
import qs from 'qs';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = qs.stringify({
    client_id: $.auth.data.consumerKey as string,
    redirect_uri: redirectUri,
    response_type: 'code',
  });

  await $.auth.set({
    url: `${$.auth.data.oauth2Url}/authorize?${searchParams}`,
  });
}
