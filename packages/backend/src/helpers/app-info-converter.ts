import AppInfoType from '../types/app-info';
import appConfig from '../config/app';

const appInfoConverter = (rawAppData: string) => {
  const computedRawData = rawAppData.replace('{BASE_URL}', appConfig.baseUrl);
  const computedJSONData: AppInfoType = JSON.parse(computedRawData)

  return computedJSONData;
}

export default appInfoConverter;
