import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Twilio',
  key: 'twilio',
  iconUrl: '{BASE_URL}/apps/twilio/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/twilio/connection',
  supportsConnections: true,
  baseUrl: 'https://twilio.com',
  apiBaseUrl: 'https://api.twilio.com',
  primaryColor: 'e1000f',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
