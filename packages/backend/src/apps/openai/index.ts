import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'OpenAI',
  key: 'openai',
  baseUrl: 'https://openai.com',
  apiBaseUrl: 'https://api.openai.com',
  iconUrl: '{BASE_URL}/apps/openai/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/openai/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
