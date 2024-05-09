import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Monday',
  key: 'monday',
  iconUrl: '{BASE_URL}/apps/monday/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/monday/connection',
  supportsConnections: true,
  baseUrl: 'https://monday.com',
  apiBaseUrl: 'https://api.monday.com/v2',
  primaryColor: 'F62B54',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
