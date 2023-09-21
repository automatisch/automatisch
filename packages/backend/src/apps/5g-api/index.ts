import defineApp from '../../helpers/define-app';
// import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: '5G API',
  key: '5g-api',
  iconUrl: '{BASE_URL}/apps/5g-api/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/5g-api/connection',
  supportsConnections: true,
  baseUrl: 'https://developer.telekom.de',
  apiBaseUrl: 'https://api.developer.telekom.de',
  primaryColor: 'e20074',
  // beforeRequest: [addAuthHeader],
  auth,
  actions,
});
