import qs from 'qs';
import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    const searchParams = {
      client_id: $.auth.data.consumerKey,
      client_secret: $.auth.data.consumerSecret,
      code: $.auth.data.code,
      grant_type: 'authorization_code',
    };
    const { data } = await $.http.post(
      `/v3/oauth/token?${qs.stringify(searchParams)}a`,
    );

    await $.auth.set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      userId: data.athlete.id,
      screenName: `${data.athlete.firstname} ${data.athlete.lastname}`,
    });
  } catch (error) {
    throw new Error('Error occured while verifying credentials!');
  }
};

export default verifyCredentials;
