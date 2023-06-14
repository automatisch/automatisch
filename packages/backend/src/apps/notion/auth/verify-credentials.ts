import { IGlobalVariable, IField } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const response = await $.http.post(
    `${$.app.apiBaseUrl}/v1/oauth/token`,
    {
      redirect_uri: redirectUri,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          $.auth.data.clientId + ':' + $.auth.data.clientSecret
        ).toString('base64')}`,
      },
      additionalProperties: {
        skipAddingAuthHeader: true
      }
    }
  );

  const data = response.data;

  $.auth.data.accessToken = data.access_token;

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    accessToken: data.access_token,
    botId: data.bot_id,
    duplicatedTemplateId: data.duplicated_template_id,
    owner: data.owner,
    tokenType: data.token_type,
    workspaceIcon: data.workspace_icon,
    workspaceId: data.workspace_id,
    workspaceName: data.workspace_name,
    screenName: data.workspace_name,
  });

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    screenName: `${currentUser.name} @ ${data.workspace_name}`,
  });
};

export default verifyCredentials;
