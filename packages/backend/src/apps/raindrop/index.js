import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Raindrop.io',
  key: 'raindrop',
  iconUrl: '{BASE_URL}/apps/raindrop/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/raindrop/connection',
  supportsConnections: true,
  baseUrl: 'https://raindrop.io',
  apiBaseUrl: 'https://api.raindrop.io',
  primaryColor: '#0ea5e9',
  auth,
  triggers,
  actions,
});
