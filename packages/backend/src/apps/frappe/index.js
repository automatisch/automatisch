import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';
import setBaseUrl from './common/set-base-url.js';
import addAuthHeader from './common/add-auth-header.js';

export default defineApp({
  name: 'Frappe / ERPNext',
  key: 'frappe',
  iconUrl: '{BASE_URL}/apps/frappe/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/frappe/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#000000',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});
