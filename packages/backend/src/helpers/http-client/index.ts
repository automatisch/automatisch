import axios, { AxiosRequestConfig } from 'axios';
export { AxiosInstance as IHttpClient } from 'axios';
import { IHttpClientParams } from '@automatisch/types';

export default function createHttpClient({ $, baseURL, beforeRequest = [] }: IHttpClientParams) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((requestConfig: AxiosRequestConfig): AxiosRequestConfig => {
    return beforeRequest.reduce((newConfig, beforeRequestFunc) => {
      return beforeRequestFunc($, newConfig);
    }, requestConfig);
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      error.response.integrationError = error.response.data;
      return error.response;
    }
  );

  return instance;
}
