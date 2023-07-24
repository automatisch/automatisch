import axios, { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

const config: AxiosRequestConfig = {};
const httpProxyUrl = process.env.http_proxy;
const httpsProxyUrl = process.env.https_proxy;
const supportsProxy = httpProxyUrl || httpsProxyUrl;

if (supportsProxy) {
  if (httpProxyUrl) {
    config.httpAgent = new HttpProxyAgent(process.env.http_proxy);
  }

  if (httpsProxyUrl) {
    config.httpsAgent = new HttpsProxyAgent(process.env.https_proxy);
  }

  config.proxy = false;
}

const axiosWithProxyInstance = axios.create(config);

export default axiosWithProxyInstance;
