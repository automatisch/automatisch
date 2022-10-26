import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if (
    requestConfig.headers &&
    $.auth.data?.accountSid &&
    $.auth.data?.authToken
  ) {
    requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    requestConfig.auth = {
      username: $.auth.data.accountSid as string,
      password: $.auth.data.authToken as string,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
