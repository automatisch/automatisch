import { IJSONObject, IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function createAuthData($: IGlobalVariable) {
  try {
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );

    const callbackUrl = oauthRedirectUrlField.value;
    const requestPath = '/oauth/request_token';
    const data = { oauth_callback: callbackUrl };

    const response = await $.http.post(requestPath, data);
    const responseData = Object.fromEntries(new URLSearchParams(response.data));

    await $.auth.set({
      url: `${$.app.apiBaseUrl}/oauth/authorize?oauth_token=${responseData.oauth_token}&perms=delete`,
      accessToken: responseData.oauth_token,
      accessSecret: responseData.oauth_token_secret,
    });
  } catch (error) {
    const errorMessages = error.response.data.errors
      .map((error: IJSONObject) => error.message)
      .join(' ');

    throw new Error(
      `Error occured while verifying credentials: ${errorMessages}`
    );
  }
}
