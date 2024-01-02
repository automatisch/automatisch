import defineApp from '../../helpers/define-app';
import setBaseUrl from './common/set-base-url';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Azure OpenAI',
  key: 'azure-openai',
  baseUrl: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/azure-openai/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/azure-openai/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
});
