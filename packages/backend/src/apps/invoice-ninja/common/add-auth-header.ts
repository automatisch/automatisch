import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { instanceUrl } = $.auth.data;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl as string;
  }

  requestConfig.headers['X-API-TOKEN'] = $.auth.data.apiToken as string;

  requestConfig.headers['X-Requested-With'] = 'XMLHttpRequest';

  requestConfig.headers['Content-Type'] =
    requestConfig.headers['Content-Type'] || 'application/json';

  return requestConfig;
};

export default addAuthHeader;
