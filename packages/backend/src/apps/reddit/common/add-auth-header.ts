import { TBeforeRequest } from '@automatisch/types';
import appConfig from '../../../config/app';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const screenName = $.auth.data?.screenName as string;
  if ($.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `${$.auth.data.tokenType} ${$.auth.data.accessToken}`;
  }

  if (screenName) {
    requestConfig.headers[
      'User-Agent'
    ] = `web:automatisch:${appConfig.version} (by /u/${screenName})`;
  } else {
    requestConfig.headers[
      'User-Agent'
    ] = `web:automatisch:${appConfig.version}`;
  }

  return requestConfig;
};

export default addAuthHeader;
