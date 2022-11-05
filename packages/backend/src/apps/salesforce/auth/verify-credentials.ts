import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';
import qs from 'qs';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field) => field.key == 'oAuthRedirectUrl'
    );
    const redirectUri = oauthRedirectUrlField.value;
    const searchParams = qs.stringify({
      code: $.auth.data.code,
      grant_type: 'authorization_code',
      client_id: $.auth.data.consumerKey as string,
      client_secret: $.auth.data.consumerSecret as string,
      redirect_uri: redirectUri,
    });
    const { data } = await $.http.post(
      `${$.auth.data.oauth2Url}/token?${searchParams}`
    );

    await $.auth.set({
      accessToken: data.access_token,
      tokenType: data.token_type,
      instanceUrl: data.instance_url,
      signature: data.signature,
      userId: data.id,
      screenName: data.instance_url,
    });

    const currentUser = await getCurrentUser($);

    await $.auth.set({
      screenName: `${currentUser.displayName} - ${data.instance_url}`,
    });
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export default verifyCredentials;
