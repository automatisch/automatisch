import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import dynamicData from './dynamic-data/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Asana',
  key: 'asana',
  baseUrl: 'https://asana.com',
  apiBaseUrl: 'https://app.asana.com/api',
  iconUrl: '{BASE_URL}/apps/asana/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/asana/connection',
  primaryColor: '690031',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  dynamicData,
  triggers,
  actions,
});
