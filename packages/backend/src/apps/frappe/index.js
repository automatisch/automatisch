import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Frappe / ERPNext',
  key: 'frappe',
  iconUrl: '{BASE_URL}/apps/frappe/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/frappe/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#000000',
  auth,
  actions
});
