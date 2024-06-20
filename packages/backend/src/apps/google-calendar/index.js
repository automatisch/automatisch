import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Google Calendar',
  key: 'google-calendar',
  baseUrl: 'https://calendar.google.com',
  apiBaseUrl: 'https://www.googleapis.com/calendar',
  iconUrl: '{BASE_URL}/apps/google-calendar/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-calendar/connection',
  primaryColor: '448AFF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
