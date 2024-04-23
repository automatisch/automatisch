import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import actions from './actions/index.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'Strava',
  key: 'strava',
  iconUrl: '{BASE_URL}/apps/strava/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/connections/strava',
  supportsConnections: true,
  baseUrl: 'https://www.strava.com',
  apiBaseUrl: 'https://www.strava.com/api',
  primaryColor: 'fc4c01',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
