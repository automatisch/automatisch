import { URL, URLSearchParams } from 'url';
import axios, { AxiosRequestConfig } from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

type TKeyAndSecret = {
  key: string;
  secret: string;
}

type THttpClientOptions = {
  baseUrl: string;
  token: TKeyAndSecret;
  consumer: TKeyAndSecret;
};

const successfulResponseInterceptor = (response: any) => response;
const failedResponseInterceptor = (error: any) => Promise.reject(error);

export default function createHttpClient(options: THttpClientOptions) {
  const { baseUrl, token, consumer } = options;

  const oauth = new OAuth({
    consumer,
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const client = axios.create({
    baseURL: baseUrl,
  });

  function beforeRequest(config: AxiosRequestConfig) {
    const { url, baseURL, method, data = {}, params = {} } = config;
    const fullUrl = new URL(url, baseURL);

    const body = {
      url: decodeURIComponent(fullUrl.toString()),
      method: method.toUpperCase(),
      data: params,
      includeBodyHash: false,
    };
    const authorization = oauth.authorize(body, token);
    const { Authorization } = oauth.toHeader(authorization);

    config.headers.Authorization = Authorization;

    return config;
  }

  client.interceptors.request.use(beforeRequest)

  client.interceptors.response.use(
    successfulResponseInterceptor,
    failedResponseInterceptor
  );

  return client;
}
