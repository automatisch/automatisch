import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'Canva',
  key: 'canva',
  baseUrl: 'https://www.canva.com',
  apiBaseUrl: 'https://api.canva.com',
  iconUrl: '{BASE_URL}/apps/canva/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/canva/connection',
  primaryColor: 'FFBF00',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth
});
