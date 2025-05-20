import memoryCache from 'memory-cache';
import appConfig from '../config/app.js';
import axios from './axios-with-proxy.js';

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

const AUTOMATISCH_LICENSE_VERIFY_URL =
  'https://license.automatisch.io/api/v1/licenses/verify';

const MATION_LICENSE_VERIFY_URL =
  'https://license.mation.work/api/v1/licenses/verify';

const hasValidLicense = async () => {
  const license = await getLicense();

  return license ? true : false;
};

const getLicense = async () => {
  const licenseKey = appConfig.licenseKey;

  if (!licenseKey) {
    return false;
  }

  const url = appConfig.isMation
    ? MATION_LICENSE_VERIFY_URL
    : AUTOMATISCH_LICENSE_VERIFY_URL;

  const cachedResponse = memoryCache.get(url);

  if (cachedResponse) {
    return cachedResponse;
  } else {
    try {
      const { data } = await axios.post(url, { licenseKey });
      memoryCache.put(url, data, CACHE_DURATION);

      return data;
    } catch (error) {
      return false;
    }
  }
};

export { getLicense, hasValidLicense };
