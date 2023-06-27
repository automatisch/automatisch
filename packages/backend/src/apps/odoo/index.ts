import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Odoo',
  key: 'odoo',
  iconUrl: '{BASE_URL}/apps/odoo/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/odoo/connection',
  supportsConnections: true,
  baseUrl: 'https://odoo.com',
  apiBaseUrl: '',
  primaryColor: '9c5789',
  auth,
  actions
});
