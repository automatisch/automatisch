import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'Vtiger CRM',
  key: 'vtiger-crm',
  iconUrl: '{BASE_URL}/apps/vtiger-crm/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/vtiger-crm/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '39a86d',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
});
