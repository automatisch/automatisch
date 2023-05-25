import { IGlobalVariable } from '@automatisch/types';

const getBaseUrl = ($: IGlobalVariable): string => {
  if ($.auth.data.instanceUrl) {
    return $.auth.data.instanceUrl as string;
  }

  if ($.app.apiBaseUrl) {
    return $.app.apiBaseUrl;
  }

  return $.app.baseUrl;
};

export default getBaseUrl;
