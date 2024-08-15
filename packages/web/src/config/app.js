const backendUrl = process.env.REACT_APP_BACKEND_URL;

const computeUrl = (url, backendUrl) => {
  /**
   * In case `backendUrl` is a host, we append the url to it.
   **/
  try {
    return new URL(url, backendUrl).toString();
  } catch (e) {
    /*
     * In case `backendUrl` is not qualified, we utilize `url` alone.
     **/
    return url;
  }
};

const config = {
  baseUrl: process.env.REACT_APP_BASE_URL,
  graphqlUrl: computeUrl('/graphql', backendUrl),
  restApiUrl: computeUrl('/api', backendUrl),
  supportEmailAddress: 'support@automatisch.io',
};

export default config;
