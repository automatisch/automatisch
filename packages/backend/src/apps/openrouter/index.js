import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'OpenRouter',
  key: 'openrouter',
  baseUrl: 'https://openrouter.ai',
  apiBaseUrl: 'https://openrouter.ai/api',
  iconUrl: '{BASE_URL}/apps/openrouter/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/openrouter/connection',
  primaryColor: '#71717a',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
