import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import actions from './actions/index.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'HubSpot',
  key: 'hubspot',
  iconUrl: '{BASE_URL}/apps/hubspot/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/hubspot/connection',
  supportsConnections: true,
  baseUrl: 'https://www.hubspot.com',
  apiBaseUrl: 'https://api.hubapi.com',
  primaryColor: 'F95C35',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
