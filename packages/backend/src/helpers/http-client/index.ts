import axios, { AxiosRequestConfig } from 'axios';
export { AxiosInstance as IHttpClient } from 'axios';
import { IHttpClientParams } from '@automatisch/types';
import { URL } from 'url';
import HttpError from '../../errors/http-error';

const removeBaseUrlForAbsoluteUrls = (
  requestConfig: AxiosRequestConfig
): AxiosRequestConfig => {
  try {
    const url = new URL(requestConfig.url);
    requestConfig.baseURL = url.origin;
    requestConfig.url = url.pathname + url.search;

    return requestConfig;
  } catch {
    return requestConfig;
  }
};

export default function createHttpClient({
  $,
  baseURL,
  beforeRequest = [],
}: IHttpClientParams) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(
    (requestConfig: AxiosRequestConfig): AxiosRequestConfig => {
      const newRequestConfig = removeBaseUrlForAbsoluteUrls(requestConfig);

      return beforeRequest.reduce((newConfig, beforeRequestFunc) => {
        return beforeRequestFunc($, newConfig);
      }, newRequestConfig);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      throw new HttpError(error.response.data);
    }
  );

  return instance;
}
