import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getAccessTokenInfo = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get(
    `/oauth/v1/access-tokens/${$.auth.data.accessToken}`
  );

  return response.data;
};

export default getAccessTokenInfo;
