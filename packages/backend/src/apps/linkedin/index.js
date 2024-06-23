import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Linkedin',
  key: 'linkedin',
  iconUrl: '{BASE_URL}/apps/linkedin/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/linkedin/connection',
  supportsConnections: true,
  baseUrl: 'https://www.linkedin.com',
  apiBaseUrl: 'https://api.linkedin.com/v2',
  primaryColor: '0077B5',
  beforeRequest: [addAuthHeader],
  auth,
  actions
});
