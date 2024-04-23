import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Flowers Software',
  key: 'flowers-software',
  iconUrl: '{BASE_URL}/apps/flowers-software/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/flowers-software/connection',
  supportsConnections: true,
  baseUrl: 'https://flowers-software.com',
  apiBaseUrl: 'https://webapp.flowers-software.com/api',
  primaryColor: '02AFC7',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
