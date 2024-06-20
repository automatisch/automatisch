import defineApp from '../../helpers/define-app.js';
import setBaseUrl from './common/set-base-url.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Helix',
  key: 'helix',
  baseUrl: 'https://tryhelix.ai',
  apiBaseUrl: 'https://app.tryhelix.ai',
  iconUrl: '{BASE_URL}/apps/helix/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/helix/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
});
