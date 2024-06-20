import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'OpenAI',
  key: 'openai',
  baseUrl: 'https://openai.com',
  apiBaseUrl: 'https://api.openai.com',
  iconUrl: '{BASE_URL}/apps/openai/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/openai/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
