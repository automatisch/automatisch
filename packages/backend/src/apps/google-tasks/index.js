import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Google Tasks',
  key: 'google-tasks',
  baseUrl: 'https://calendar.google.com/calendar/u/0/r/tasks',
  apiBaseUrl: 'https://tasks.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-tasks/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-tasks/connection',
  primaryColor: '0066DA',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
  triggers,
});
