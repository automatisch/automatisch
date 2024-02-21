import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import setBaseUrl from './common/set-base-url.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Bigin By Zoho CRM',
  key: 'bigin-by-zoho-crm',
  baseUrl: 'https://www.bigin.com',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/bigin-by-zoho-crm/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/bigin-by-zoho-crm/connection',
  primaryColor: '039649',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});
