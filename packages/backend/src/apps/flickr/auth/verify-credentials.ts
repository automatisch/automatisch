import { IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const response = await $.http.post(
    `/oauth/access_token?oauth_verifier=${$.auth.data.oauth_verifier}&oauth_token=${$.auth.data.accessToken}`,
    null
  );

  const responseData = Object.fromEntries(new URLSearchParams(response.data));

  await $.auth.set({
    consumerKey: $.auth.data.consumerKey,
    consumerSecret: $.auth.data.consumerSecret,
    accessToken: responseData.oauth_token,
    accessSecret: responseData.oauth_token_secret,
    userId: responseData.user_nsid,
    screenName: responseData.fullname,
  });
};

export default verifyCredentials;
