import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import setBaseUrl from './common/set-base-url.js';

export default defineApp({
  name: 'FreeScout',
  key: 'freescout',
  iconUrl: '{BASE_URL}/apps/freescout/assets/favicon.svg',
  supportsConnections: true,
  baseUrl: 'https://freescout.net',
  primaryColor: '#F5D05E',
  authDocUrl: '{DOCS_URL}/apps/freescout/connection',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
});
