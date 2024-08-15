import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Ghost',
  key: 'ghost',
  baseUrl: 'https://ghost.org',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/ghost/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/ghost/connection',
  primaryColor: '15171A',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
});
