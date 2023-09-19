import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Google Calendar',
  key: 'google-calendar',
  baseUrl: 'https://calendar.google.com',
  apiBaseUrl: 'https://www.googleapis.com/calendar',
  iconUrl: '{BASE_URL}/apps/google-calendar/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-calendar/connection',
  primaryColor: '448AFF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
