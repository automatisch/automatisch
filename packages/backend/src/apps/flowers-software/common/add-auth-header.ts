import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { data } = $.auth;

  if (data?.username && data.password && data.apiKey) {
    requestConfig.headers['x-api-key'] = data.apiKey as string;

    requestConfig.auth = {
      username: data.username as string,
      password: data.password as string,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
