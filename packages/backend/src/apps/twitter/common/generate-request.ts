import { Token } from 'oauth-1.0a';
import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import oauthClient from './oauth-client';

type IGenereateRequestOptons = {
  requestPath: string;
  method: string;
  data?: IJSONObject;
};

const generateRequest = async (
  $: IGlobalVariable,
  options: IGenereateRequestOptons
) => {
  const { requestPath, method, data } = options;

  const token: Token = {
    key: $.auth.data.accessToken as string,
    secret: $.auth.data.accessSecret as string,
  };

  const requestData = {
    url: `${$.app.baseUrl}${requestPath}`,
    method,
    data,
  };

  const authHeader = oauthClient($).toHeader(
    oauthClient($).authorize(requestData, token)
  );

  const response = await $.http.post(`/oauth/request_token`, null, {
    headers: { ...authHeader },
  });

  return response;
};

export default generateRequest;
