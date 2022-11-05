import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = {
    code: $.auth.data.code,
    client_id: $.auth.data.consumerKey,
    client_secret: $.auth.data.consumerSecret,
    redirect_uri: redirectUri,
  };
  const response = await $.http.post('/oauth.v2.access', null, { params });

  if (response.data.ok === false) {
    throw new Error(
      `Error occured while verifying credentials: ${response.data.error}. (More info: https://api.slack.com/methods/oauth.v2.access#errors)`
    );
  }

  const {
    bot_user_id: botId,
    authed_user: { id: userId, access_token: userAccessToken },
    access_token: botAccessToken,
    team: { name: teamName },
  } = response.data;

  await $.auth.set({
    botId,
    userId,
    userAccessToken,
    botAccessToken,
    screenName: teamName,
    token: $.auth.data.accessToken,
  });

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    screenName: `${currentUser.real_name} @ ${teamName}`,
  });
};

export default verifyCredentials;
