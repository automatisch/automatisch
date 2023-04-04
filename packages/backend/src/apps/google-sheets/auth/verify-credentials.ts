import { IField, IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

type TUser = {
  displayName: string;
  metadata: {
    primary: boolean;
  };
};

type TEmailAddress = {
  value: string;
  metadata: {
    primary: boolean;
  };
};

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const { data } = await $.http.post(`https://oauth2.googleapis.com/token`, {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  const { displayName } = currentUser.names.find(
    (name: TUser) => name.metadata.primary
  );
  const { value: email } = currentUser.emailAddresses.find(
    (emailAddress: TEmailAddress) => emailAddress.metadata.primary
  );

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    resourceName: currentUser.resourceName,
    screenName: `${displayName} - ${email}`,
  });
};

export default verifyCredentials;
