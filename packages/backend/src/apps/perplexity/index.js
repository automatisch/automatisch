import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Perplexity',
  key: 'perplexity',
  baseUrl: 'https://perplexity.ai',
  apiBaseUrl: 'https://api.perplexity.ai',
  iconUrl: '{BASE_URL}/apps/perplexity/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/perplexity/connection',
  primaryColor: '#091717',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
