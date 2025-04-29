import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Microsoft Teams',
  key: 'microsoft-teams',
  baseUrl: 'https://teams.live.com',
  apiBaseUrl: 'https://graph.microsoft.com',
  iconUrl: '{BASE_URL}/apps/microsoft-teams/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/microsoft-teams/connection',
  primaryColor: '464EB8',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
