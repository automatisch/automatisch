const backendUrl = import.meta.env.VITE_BACKEND_URL;

const computeUrl = (url, backendUrl) => {
  /**
   * In case `backendUrl` is a host, we append the url to it.
   **/
  try {
    return new window.URL(url, backendUrl).toString();
  } catch {
    /*
     * In case `backendUrl` is not qualified, we utilize `url` alone.
     **/
    return url;
  }
};

const config = {
  baseUrl: import.meta.env.VITE_BASE_URL,
  restApiUrl: computeUrl('/internal/api', backendUrl),
  useNewFlowEditor: import.meta.env.VITE_USE_NEW_FLOW_EDITOR === 'true',
  supportEmailAddress: 'support@automatisch.io',
};

export default config;
