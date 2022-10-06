import type { IApp } from '@automatisch/types';
import appConfig from '../config/app';

const appInfoConverter = (rawAppData: IApp) => {
  const stringifiedRawAppData = JSON.stringify(rawAppData);

  let computedRawData = stringifiedRawAppData.replace(
    '{BASE_URL}',
    appConfig.baseUrl
  );
  computedRawData = computedRawData.replace(
    '{WEB_APP_URL}',
    appConfig.webAppUrl
  );

  const computedJSONData: IApp = JSON.parse(computedRawData);
  return computedJSONData;
};

export default appInfoConverter;
