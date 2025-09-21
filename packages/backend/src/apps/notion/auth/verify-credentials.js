import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
  // Test the integration token by making a simple API call
  const response = await $.http.get('/v1/users/me', {
    headers: {
      Authorization: `Bearer ${$.auth.data.integrationToken}`,
      'Notion-Version': '2022-06-28',
    },
    additionalProperties: {
      skipAddingAuthHeader: true,
    },
  });

  const user = response.data;

  await $.auth.set({
    integrationToken: $.auth.data.integrationToken,
    accessToken: $.auth.data.integrationToken, // Use integration token as access token
    botId: user.id,
    screenName: user.name || user.id,
  });
};

export default verifyCredentials;
