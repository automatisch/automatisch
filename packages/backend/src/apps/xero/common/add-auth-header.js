const addAuthHeader = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingAuthHeader)
    return requestConfig;

  if ($.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `${$.auth.data.tokenType} ${$.auth.data.accessToken}`;
  }

  if ($.auth.data?.tenantId) {
    requestConfig.headers['Xero-tenant-id'] = $.auth.data.tenantId;
  }

  return requestConfig;
};

export default addAuthHeader;
