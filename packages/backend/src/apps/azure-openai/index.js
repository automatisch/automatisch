import defineApp from '../../helpers/define-app.js';
import setBaseUrl from './common/set-base-url.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Azure OpenAI',
  key: 'azure-openai',
  baseUrl:
    'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/azure-openai/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/azure-openai/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
});
