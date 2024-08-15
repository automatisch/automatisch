import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Remove.bg',
  key: 'removebg',
  iconUrl: '{BASE_URL}/apps/removebg/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/removebg/connection',
  supportsConnections: true,
  baseUrl: 'https://www.remove.bg',
  apiBaseUrl: 'https://api.remove.bg/v1.0',
  primaryColor: '55636c',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
