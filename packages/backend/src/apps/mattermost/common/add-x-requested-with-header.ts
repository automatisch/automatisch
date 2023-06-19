import { TBeforeRequest } from '@automatisch/types';

const addXRequestedWithHeader: TBeforeRequest = ($, requestConfig) => {
  // This is not documented yet required
  // ref. https://forum.mattermost.com/t/solved-invalid-or-expired-session-please-login-again/6772
  requestConfig.headers = requestConfig.headers || {};
  requestConfig.headers['X-Requested-With'] = `XMLHttpRequest`;
  return requestConfig;
};

export default addXRequestedWithHeader;
