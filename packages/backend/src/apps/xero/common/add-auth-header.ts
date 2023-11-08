import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingAuthHeader)
    return requestConfig;

  if ($.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `${$.auth.data.tokenType} ${$.auth.data.accessToken}`;
  }

  if ($.auth.data?.tenantId) {
    requestConfig.headers['Xero-tenant-id'] = $.auth.data.tenantId as string;
  }

  return requestConfig;
};

export default addAuthHeader;
