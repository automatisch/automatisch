import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

const config = axios.defaults;
const httpProxyUrl = process.env.http_proxy;
const httpsProxyUrl = process.env.https_proxy;
const supportsProxy = httpProxyUrl || httpsProxyUrl;
const noProxyEnv = process.env.no_proxy;
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

axiosWithProxyInstance.interceptors.request.use(function skipProxyIfInNoProxy(requestConfig) {
  const hostname = new URL(requestConfig.url).hostname;

  if (supportsProxy && shouldSkipProxy(hostname)) {
    requestConfig.httpAgent = undefined;
    requestConfig.httpsAgent = undefined;
  }

  return requestConfig;
});

export default axiosWithProxyInstance;
