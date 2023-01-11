import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const { data } = await $.http.post(
    `${$.app.baseUrl}/oauth/access_token`,
    {
      client_id: $.auth.data.clientId,
      client_secret: $.auth.data.clientSecret,
      code: $.auth.data.code,
    },
  );

  await $.auth.set({
    tokenType: data.token_type,
    accessToken: data.access_token,
  });
};

export default verifyCredentials;
