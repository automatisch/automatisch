import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Bluesky',
  key: 'bluesky',
  iconUrl: '{BASE_URL}/apps/bluesky/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/bluesky/connection',
  supportsConnections: true,
  baseUrl: 'https://bluesky.app',
  apiBaseUrl: 'https://bsky.social/xrpc',
  primaryColor: '1185fd',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
