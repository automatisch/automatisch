import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import dynamicData from './dynamic-data/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Eventbrite',
  key: 'eventbrite',
  iconUrl: '{BASE_URL}/apps/eventbrite/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/eventbrite/connection',
  supportsConnections: true,
  baseUrl: 'https://eventbrite.com',
  apiBaseUrl: 'https://www.eventbriteapi.com/v3',
  primaryColor: 'D1410C',
  beforeRequest: [addAuthHeader],
  auth,
  dynamicData,
  triggers,
});
