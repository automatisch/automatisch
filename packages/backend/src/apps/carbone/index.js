import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Carbone',
  key: 'carbone',
  iconUrl: '{BASE_URL}/apps/carbone/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/carbone/connection',
  supportsConnections: true,
  baseUrl: 'https://carbone.io',
  apiBaseUrl: 'https://api.carbone.io',
  primaryColor: '6f42c1',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
