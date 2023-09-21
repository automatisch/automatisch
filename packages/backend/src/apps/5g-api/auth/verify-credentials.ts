import { IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const verifyCredentials = async ($: IGlobalVariable) => {
  const claims = {
    application_id: $.auth.data.applicationId as string,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
    jti: uuidv4(),
  };

  const privateKey = ($.auth.data.privateKey as string).replaceAll('\\n', '\n');

  const jwtToken = jwt.sign(claims, privateKey, {
    algorithm: 'RS256',
  });

  const headers = {
    Authorization: 'Bearer ' + jwtToken,
  };

  const response = await $.http.post(
    'https://api.nexmo.com/oauth2/token?grant_type=client_credentials',
    null,
    { headers }
  );

  const responseData = Object.fromEntries(new URLSearchParams(response.data));

  await $.auth.set({
    accessToken: responseData.access_token,
    tokenType: responseData.token_type,
    expiresIn: responseData.expires_in,
  });
};

export default verifyCredentials;
