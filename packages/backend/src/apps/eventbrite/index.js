import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import dynamicData from './dynamic-data/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Eventbrite',
  key: 'eventbrite',
  baseUrl: 'https://www.eventbrite.com',
  apiBaseUrl: 'https://www.eventbriteapi.com',
  iconUrl: '{BASE_URL}/apps/eventbrite/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/eventbrite/connection',
  primaryColor: 'F05537',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  dynamicData,
  triggers,
  actions,
});
