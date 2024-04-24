import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Xero',
  key: 'xero',
  baseUrl: 'https://go.xero.com',
  apiBaseUrl: 'https://api.xero.com',
  iconUrl: '{BASE_URL}/apps/xero/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/xero/connection',
  primaryColor: '13B5EA',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
