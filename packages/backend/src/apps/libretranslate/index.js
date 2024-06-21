import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import addApiKey from './common/add-api-key.js';
import setBaseUrl from './common/set-base-url.js';

export default defineApp({
  name: 'LibreTranslate',
  key: 'libretranslate',
  iconUrl: '{BASE_URL}/apps/libretranslate/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/libretranslate/connection',
  supportsConnections: true,
  baseUrl: 'https://libretranslate.com',
  apiBaseUrl: 'https://libretranslate.com',
  primaryColor: 'ffffff',
  beforeRequest: [setBaseUrl, addApiKey],
  auth,
});
