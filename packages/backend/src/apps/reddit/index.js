import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Reddit',
  key: 'reddit',
  baseUrl: 'https://www.reddit.com',
  apiBaseUrl: 'https://oauth.reddit.com',
  iconUrl: '{BASE_URL}/apps/reddit/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/reddit/connection',
  primaryColor: 'FF4500',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
});
