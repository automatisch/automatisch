import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data?.token) {
    requestConfig.headers.Authorization = `OAuth oauth_consumer_key="${$.auth.data.apiKey}", oauth_token="${$.auth.data.token}"`;
  }

  requestConfig.headers.Accept = 'application/json';

  return requestConfig;
};

export default addAuthHeader;
