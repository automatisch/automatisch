import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'Flowers Software',
  key: 'flowers-software',
  iconUrl: '{BASE_URL}/apps/flowers-software/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/flowers-software/connection',
  supportsConnections: true,
  baseUrl: 'https://flowers-software.com',
  apiBaseUrl: 'https://webapp.flowers-software.com/api',
  primaryColor: '02AFC7',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
