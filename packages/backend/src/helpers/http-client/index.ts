import axios, { AxiosRequestConfig } from 'axios';
export { AxiosInstance as IHttpClient } from 'axios';
import { IHttpClientParams } from '@automatisch/types';
import { URL } from 'url';
import HttpError from '../../errors/http';

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
    async (error) => {
      const { config, response } = error;
      // Do not destructure `status` from `error.response` because it might not exist
      const status = response?.status;

      if (
        // TODO: provide a `shouldRefreshToken` function in the app
        (status === 401 || status === 403) &&
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
