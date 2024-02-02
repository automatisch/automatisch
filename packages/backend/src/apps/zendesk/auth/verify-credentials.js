import getCurrentUser from '../common/get-current-user.js';
import scopes from '../common/auth-scope.js';

const verifyCredentials = async ($) => {
  await getAccessToken($);

  const user = await getCurrentUser($);
  const subdomain = extractSubdomain($.auth.data.instanceUrl);
  const name = user.name;
  const screenName = [name, subdomain].filter(Boolean).join(' @ ');

  await $.auth.set({
    screenName,
    apiToken: $.auth.data.apiToken,
    instanceUrl: $.auth.data.instanceUrl,
    email: $.auth.data.email,
  });
};

const getAccessToken = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;

  const response = await $.http.post(`/oauth/tokens`, {
    redirect_uri: redirectUri,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    scope: scopes.join(' '),
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
  });

  const data = response.data;

  $.auth.data.accessToken = data.access_token;

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    accessToken: data.access_token,
    tokenType: data.token_type,
  });
};

function extractSubdomain(url) {
  const match = url.match(/https:\/\/(.*?)\.zendesk\.com/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export default verifyCredentials;
