import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['api-key'] = $.auth.data.apiKey as string;
  }

  requestConfig.params = {
    'api-version': '2023-10-01-preview'
  }

  return requestConfig;
};

export default addAuthHeader;
