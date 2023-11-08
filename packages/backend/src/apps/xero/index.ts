import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Xero',
  key: 'xero',
  baseUrl: 'https://go.xero.com',
  apiBaseUrl: 'https://api.xero.com',
  iconUrl: '{BASE_URL}/apps/xero/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/xero/connection',
  primaryColor: '13B5EA',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
