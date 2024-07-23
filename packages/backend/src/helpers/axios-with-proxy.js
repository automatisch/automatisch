import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import appConfig from '../config/app.js';

const config = axios.defaults;
const httpProxyUrl = appConfig.httpProxy;
const httpsProxyUrl = appConfig.httpsProxy;
const supportsProxy = httpProxyUrl || httpsProxyUrl;
const noProxyEnv = appConfig.noProxy;
const noProxyHosts = noProxyEnv ? noProxyEnv.split(',').map(host => host.trim()) : [];

if (supportsProxy) {
  if (httpProxyUrl) {
    config.httpAgent = new HttpProxyAgent(httpProxyUrl);
  }

  if (httpsProxyUrl) {
    config.httpsAgent = new HttpsProxyAgent(httpsProxyUrl);
  }

  config.proxy = false;
}

const axiosWithProxyInstance = axios.create(config);

function shouldSkipProxy(hostname) {
  return noProxyHosts.some(noProxyHost => {
    return hostname.endsWith(noProxyHost) || hostname === noProxyHost;
  });
};

/**
 * The interceptors are executed in the reverse order they are added.
 */
axiosWithProxyInstance.interceptors.request.use(
  function skipProxyIfInNoProxy(requestConfig) {
    const hostname = new URL(requestConfig.baseURL).hostname;

    if (supportsProxy && shouldSkipProxy(hostname)) {
      requestConfig.httpAgent = undefined;
      requestConfig.httpsAgent = undefined;
    }

    return requestConfig;
  },
  undefined,
  { synchronous: true }
);

axiosWithProxyInstance.interceptors.request.use(
  function removeBaseUrlForAbsoluteUrls(requestConfig) {
    /**
     * If the URL is an absolute URL, we remove its origin out of the URL
     * and set it as baseURL. This lets us streamlines the requests made by Automatisch
     * and requests made by app integrations.
     */
    try {
      const url = new URL(requestConfig.url);
      requestConfig.baseURL = url.origin;
      requestConfig.url = url.pathname + url.search;

      return requestConfig;
    } catch {
      return requestConfig;
    }
  },
  undefined,
  { synchronous: true}
);

export default axiosWithProxyInstance;
