import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

async function getTokenInfo($: IGlobalVariable) {
  const basicAuthToken = Buffer.from(
    $.auth.data.consumerKey + ':' + $.auth.data.consumerSecret
  ).toString('base64');

  const headers = {
    Authorization: `Basic ${basicAuthToken}`,
  };

  const body = {
    access_token: $.auth.data.accessToken,
  };

  return await $.http.post(
    `${$.app.baseUrl}/applications/${$.auth.data.consumerKey}/token`,
    body,
    { headers }
  );
}

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    const response = await $.http.post(
      `${$.app.baseUrl}/login/oauth/access_token`,
      {
        client_id: $.auth.data.consumerKey,
        client_secret: $.auth.data.consumerSecret,
        code: $.auth.data.oauthVerifier,
      },
      {
        headers: {
          Accept: 'application/json'
        }
      });

    const data = response.data;

    $.auth.data.accessToken = data.access_token;

    const currentUser = await getCurrentUser($);

    await $.auth.set({
      consumerKey: $.auth.data.consumerKey,
      consumerSecret: $.auth.data.consumerSecret,
      accessToken: data.access_token,
      scope: data.scope,
      tokenType: data.token_type,
      userId: currentUser.id,
      screenName: currentUser.login,
    });
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export default verifyCredentials;
