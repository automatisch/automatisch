import AppInfoType from '../types/app-info';
import appConfig from '../config/app';

const appInfoConverter = (rawAppData: string) => {
  let computedRawData = rawAppData.replace('{BASE_URL}', appConfig.baseUrl);
  computedRawData = computedRawData.replace('{WEB_APP_URL}', appConfig.webAppUrl);

  const computedJSONData: AppInfoType = JSON.parse(computedRawData)
  return computedJSONData;
}

export default appInfoConverter;
