import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

export default defineApp({
  actions,
  apiBaseUrl: 'https://gateway.seven.io/api',
  auth,
  authDocUrl: 'https://help.seven.io/en/api-key-access',
  baseUrl: 'https://www.seven.io',
  beforeRequest: [addAuthHeader],
  iconUrl: '{BASE_URL}/apps/seven/assets/favicon.svg',
  key: 'seven',
  name: 'Seven',
  primaryColor: '00d488',
  supportsConnections: true,
  triggers,
});
