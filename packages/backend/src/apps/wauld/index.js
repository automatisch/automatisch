import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Wauld',
  key: 'wauld',
  iconUrl: '{BASE_URL}/apps/wauld/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/wauld/connection',
  supportsConnections: true,
  baseUrl: 'https://wauld.com',
  apiBaseUrl: 'https://wauld.com',
  primaryColor: '#067FFF',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});