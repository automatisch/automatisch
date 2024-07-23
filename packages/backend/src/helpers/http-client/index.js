import HttpError from '../../errors/http.js';
import axios from '../axios-with-proxy.js';

// Mutates the `toInstance` by copying the request interceptors from `fromInstance`
const copyRequestInterceptors = (fromInstance, toInstance) => {
  // Copy request interceptors
  fromInstance.interceptors.request.forEach(interceptor => {
    toInstance.interceptors.request.use(
      interceptor.fulfilled,
      interceptor.rejected,
      {
        synchronous: interceptor.synchronous,
        runWhen: interceptor.runWhen
      }
    );
  });
}

export default function createHttpClient({ $, baseURL, beforeRequest = [] }) {
  const instance = axios.create({
    baseURL,
  });

  // 1. apply the beforeRequest functions from the app
  instance.interceptors.request.use((requestConfig) => {
    const result = beforeRequest.reduce((newConfig, beforeRequestFunc) => {
      return beforeRequestFunc($, newConfig);
    }, requestConfig);

    return result;
  });

  // 2. inherit the request inceptors from the parent instance
  copyRequestInterceptors(axios, instance);

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
