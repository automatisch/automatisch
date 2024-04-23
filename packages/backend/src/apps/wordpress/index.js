import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'WordPress',
  key: 'wordpress',
  iconUrl: '{BASE_URL}/apps/wordpress/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/wordpress/connection',
  supportsConnections: true,
  baseUrl: 'https://wordpress.com',
  apiBaseUrl: '',
  primaryColor: '464342',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
