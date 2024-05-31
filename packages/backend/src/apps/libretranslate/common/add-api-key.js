const addApiKey = ($, requestConfig) => {
  const apiKey = $.auth.data.apiKey;

  requestConfig.data = { api_key: apiKey, ...(requestConfig.data || {}) };

  return requestConfig;
};

export default addApiKey;
