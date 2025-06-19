import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Together AI',
  key: 'together-ai',
  baseUrl: 'https://together.ai',
  apiBaseUrl: 'https://api.together.xyz',
  iconUrl: '{BASE_URL}/apps/together-ai/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/together-ai/connection',
  primaryColor: '#000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
