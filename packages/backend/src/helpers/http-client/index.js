import HttpError from '../../errors/http.js';
import { createInstance } from '../axios-with-proxy.js';

export default function createHttpClient({ $, baseURL, beforeRequest = [] }) {
  async function interceptResponseError(error) {
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
  };

  const instance = createInstance(
    {
      baseURL,
    },
    {
      requestInterceptor: beforeRequest.map((originalBeforeRequest) => {
        return async (requestConfig) => await originalBeforeRequest($, requestConfig);
      }),
      responseErrorInterceptor: interceptResponseError,
    }
  )

  return instance;
}
