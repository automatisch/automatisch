import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Pushover',
  key: 'pushover',
  baseUrl: 'https://pushover.net',
  apiBaseUrl: 'https://api.pushover.net',
  iconUrl: '{BASE_URL}/apps/pushover/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/pushover/connection',
  primaryColor: '249DF1',
  supportsConnections: true,
  auth,
  actions,
  dynamicData,
});
