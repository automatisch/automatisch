import appConfig from '../../../config/app.js';

const addAuthHeader = ($, requestConfig) => {
  const screenName = $.auth.data?.screenName;
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
