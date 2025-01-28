const setEndpoint = ($, requestConfig) => {
  const { organization } = $.auth.data;

  const [path, query] = requestConfig.url.split('?');
  const urlParams = new URLSearchParams(query);
  urlParams.set('api-version', '7.1-preview');

  requestConfig.url = `https://dev.azure.com/${organization}${path}?${urlParams.toString()}`;

  return requestConfig;
};

export default setEndpoint;
