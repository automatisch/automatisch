import { IHttpClientParams } from '@automatisch/types';
import { InternalAxiosRequestConfig } from 'axios';
import { URL } from 'node:url';
export { AxiosInstance as IHttpClient } from 'axios';

import HttpError from '../../errors/http';
import axios from '../axios-with-proxy';

const removeBaseUrlForAbsoluteUrls = (
  requestConfig: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
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
    (requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const newRequestConfig = removeBaseUrlForAbsoluteUrls(requestConfig);

      const result = beforeRequest.reduce((newConfig, beforeRequestFunc) => {
        return beforeRequestFunc($, newConfig);
      }, newRequestConfig);

      /**
       * axios seems to want InternalAxiosRequestConfig returned not AxioRequestConfig
       * anymore even though requests do require AxiosRequestConfig.
       *
       * Since both interfaces are very similar (InternalAxiosRequestConfig
       * extends AxiosRequestConfig), we can utilize an assertion below
       **/
      return result as InternalAxiosRequestConfig;
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;
      // Do not destructure `status` from `error.response` because it might not exist
      const status = response?.status;

      if (
        // TODO: provide a `shouldRefreshToken` function in the app
        (status === 401 || status === 403) &&
        $.app.auth &&
        $.app.auth.refreshToken &&
        !$.app.auth.isRefreshTokenRequested
      ) {
        $.app.auth.isRefreshTokenRequested = true;
        await $.app.auth.refreshToken($);

        // retry the previous request before the expired token error
        const newResponse = await instance.request(config);
        $.app.auth.isRefreshTokenRequested = false;

        return newResponse;
      }

      throw new HttpError(error);
    }
  );

  return instance;
}
