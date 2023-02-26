import axios from 'axios';
import appConfig from '../config/app';
import memoryCache from 'memory-cache';

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

const checkLicense = async () => {
  const licenseKey = appConfig.licenseKey;

  if (!licenseKey) {
    return false;
  }

  const url = 'https://license.automatisch.io/api/v1/licenses/verify';
  const cachedResponse = memoryCache.get(url);

  if (cachedResponse) {
    return cachedResponse;
  } else {
    try {
      const { data } = await axios.post(url, { licenseKey });
      memoryCache.put(url, data.verified, CACHE_DURATION);

      return data.verified;
    } catch (error) {
      return false;
    }
  }
};

export default checkLicense;
