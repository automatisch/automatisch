import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import actions from './actions';
import auth from './auth';

export default defineApp({
  name: 'Strava',
  key: 'strava',
  iconUrl: '{BASE_URL}/apps/strava/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/strava',
  supportsConnections: true,
  baseUrl: 'https://www.strava.com',
  apiBaseUrl: 'https://www.strava.com/api',
  primaryColor: 'fc4c01',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
