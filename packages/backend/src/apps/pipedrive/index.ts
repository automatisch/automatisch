import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'Pipedrive',
  key: 'pipedrive',
  baseUrl: '',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/pipedrive/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/pipedrive/connection',
  primaryColor: 'FFFFFF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
