const addAuthHeader = ($, requestConfig) => {
  if (requestConfig.url.includes('/api/method/frappe.integrations.oauth2.get_token')) {
    return requestConfig;
  }

  if (requestConfig.headers && $.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
