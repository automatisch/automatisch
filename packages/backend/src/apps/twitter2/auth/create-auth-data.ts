import generateRequest from '../common/generate-request';
import { IJSONObject, IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function createAuthData($: IGlobalVariable) {
  try {
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );

    const callbackUrl = oauthRedirectUrlField.value;

    const response = await generateRequest($, {
      requestPath: '/oauth/request_token',
      method: 'POST',
      data: { oauth_callback: callbackUrl },
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
