import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const userLogin = $.auth.data.userLogin as string;
  const password = $.auth.data.password as string;

  if (userLogin && password) {
    requestConfig.auth = {
      username: userLogin,
      password,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
