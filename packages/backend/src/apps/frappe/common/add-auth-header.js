import { OAUTH_ENDPOINTS } from "./constants";

const addAuthHeader = ($, requestConfig) => {
  if (requestConfig.url.includes(OAUTH_ENDPOINTS.GET_TOKEN)) {
    return requestConfig;
  }

  if (requestConfig.headers && $.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
