import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  const yourResourceName = $.auth.data.yourResourceName as string;

  if (yourResourceName) {
    requestConfig.baseURL = `https://${yourResourceName}.openai.azure.com/openai`;
  }

  return requestConfig;
};

export default setBaseUrl;
