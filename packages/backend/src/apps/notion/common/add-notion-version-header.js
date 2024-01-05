const addNotionVersionHeader = ($, requestConfig) => {
  requestConfig.headers['Notion-Version'] = '2022-06-28';

  return requestConfig;
};

export default addNotionVersionHeader;
