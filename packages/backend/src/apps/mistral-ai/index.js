import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Mistral AI',
  key: 'mistral-ai',
  baseUrl: 'https://mistral.ai',
  apiBaseUrl: 'https://api.mistral.ai',
  iconUrl: '{BASE_URL}/apps/mistral-ai/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/mistral-ai/connection',
  primaryColor: '#000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
