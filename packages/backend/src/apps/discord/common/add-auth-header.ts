import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { tokenType, botToken } = $.auth.data;
  if (tokenType && botToken) {
    requestConfig.headers.Authorization = `Bot ${botToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
