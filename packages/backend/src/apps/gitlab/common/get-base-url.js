const getBaseUrl = ($) => {
  if ($.auth.data.instanceUrl) {
    return $.auth.data.instanceUrl;
  }

  if ($.app.apiBaseUrl) {
    return $.app.apiBaseUrl;
  }

  return $.app.baseUrl;
};

export default getBaseUrl;
