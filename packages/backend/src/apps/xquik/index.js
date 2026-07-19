import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Xquik',
  key: 'xquik',
  baseUrl: 'https://xquik.com',
  apiBaseUrl: 'https://xquik.com/api/v1',
  iconUrl: '{BASE_URL}/apps/xquik/assets/favicon.svg',
  authDocUrl: 'https://docs.xquik.com/api-reference/authentication',
  primaryColor: '#4c2626',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
