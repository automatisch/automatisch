import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Twitter',
  key: 'twitter',
  iconUrl: '{BASE_URL}/apps/twitter/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/twitter/connection',
  supportsConnections: true,
  baseUrl: 'https://twitter.com',
  apiBaseUrl: 'https://api.twitter.com',
  primaryColor: '1da1f2',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
});
