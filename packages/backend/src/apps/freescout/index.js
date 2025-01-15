import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'FreeScout',
  key: 'freescout',
  iconUrl: '{BASE_URL}/apps/freescout/assets/favicon.svg',
  supportsConnections: true,
  baseUrl: 'https://freescout.net',
  apiBaseUrl: 'https://freescout.net',
  primaryColor: '#F5D05E',
  authDocUrl: '{DOCS_URL}/apps/freescout/connection',
  beforeRequest: [addAuthHeader],
  auth,
  triggers
});