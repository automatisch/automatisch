import { TBeforeRequest } from '@automatisch/types';

const addNotionVersionHeader: TBeforeRequest = ($, requestConfig) => {
  requestConfig.headers['Notion-Version'] = '2022-06-28';

  return requestConfig;
};

export default addNotionVersionHeader;
