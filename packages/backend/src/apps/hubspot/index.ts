import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import actions from './actions';
import auth from './auth';

export default defineApp({
  name: 'HubSpot',
  key: 'hubspot',
  iconUrl: '{BASE_URL}/apps/hubspot/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/hubspot/connection',
  supportsConnections: true,
  baseUrl: 'https://www.hubspot.com',
  apiBaseUrl: 'https://api.hubapi.com',
  primaryColor: 'F95C35',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
