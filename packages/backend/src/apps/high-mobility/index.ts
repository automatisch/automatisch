import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'High Mobility',
  key: 'high-mobility',
  iconUrl: '{BASE_URL}/apps/high-mobility/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/high-mobility/connection',
  supportsConnections: true,
  baseUrl: 'https://high-mobility.com',
  apiBaseUrl: 'https://api.high-mobility.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
