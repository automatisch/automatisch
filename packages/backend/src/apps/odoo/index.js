import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Odoo',
  key: 'odoo',
  iconUrl: '{BASE_URL}/apps/odoo/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/odoo/connection',
  supportsConnections: true,
  baseUrl: 'https://odoo.com',
  apiBaseUrl: '',
  primaryColor: '9c5789',
  auth,
  actions,
});
