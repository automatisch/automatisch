import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'PostgreSQL',
  key: 'postgresql',
  iconUrl: '{BASE_URL}/apps/postgresql/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/postgresql/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '336791',
  auth,
  actions,
});
