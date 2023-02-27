import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data.serverUrl) {
    requestConfig.baseURL = $.auth.data.serverUrl as string;
  }

  if ($.auth.data?.username && $.auth.data?.password) {
    requestConfig.auth = {
      username: $.auth.data.username as string,
      password: $.auth.data.password as string,
    }
  }

  return requestConfig;
};

export default addAuthHeader;
