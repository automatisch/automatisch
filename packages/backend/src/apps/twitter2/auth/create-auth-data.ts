import { IJSONObject, IField } from '@automatisch/types';
import oauthClient from '../common/oauth-client';
import { URLSearchParams } from 'url';

export default async function createAuthData($: any) {
  try {
    const oauthRedirectUrlField = $.app.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );

    const callbackUrl = oauthRedirectUrlField.value;

    const requestData = {
      url: `${$.app.baseUrl}/oauth/request_token`,
      method: 'POST',
      data: { oauth_callback: callbackUrl },
    };

    const authHeader = oauthClient($).toHeader(
      oauthClient($).authorize(requestData)
    );

    const response = await $.http.post(`/oauth/request_token`, null, {
      headers: { ...authHeader },
    });

    const responseData = Object.fromEntries(new URLSearchParams(response.data));

    await $.auth.set({
      url: `${$.app.baseUrl}/oauth/authorize?oauth_token=${responseData.oauth_token}`,
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
