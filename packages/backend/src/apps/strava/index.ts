import defineApp from '../../helpers/define-app';

export default defineApp({
  name: 'Strava',
  key: 'strava',
  iconUrl: '{BASE_URL}/apps/strava/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/strava',
  supportsConnections: true,
  baseUrl: 'https://www.strava.com',
  apiBaseUrl: 'https://www.strava.com/api',
  primaryColor: 'fc4c01',
});
