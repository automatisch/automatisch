import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'ClickUp',
  key: 'clickup',
  baseUrl: 'https://clickup.com',
  apiBaseUrl: 'https://api.clickup.com/api',
  iconUrl: '{BASE_URL}/apps/clickup/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/clickup/connection',
  primaryColor: '#FD71AF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
  dynamicFields,
});
