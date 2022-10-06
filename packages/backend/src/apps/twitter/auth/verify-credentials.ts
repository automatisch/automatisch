import { IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    const response = await $.http.post(
      `/oauth/access_token?oauth_verifier=${$.auth.data.oauthVerifier}&oauth_token=${$.auth.data.accessToken}`,
      null
    );

    const responseData = Object.fromEntries(new URLSearchParams(response.data));

    await $.auth.set({
      accessToken: responseData.oauth_token,
      accessSecret: responseData.oauth_token_secret,
      userId: responseData.user_id,
      screenName: responseData.screen_name,
    });
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export default verifyCredentials;
