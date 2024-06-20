import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'SMTP',
  key: 'smtp',
  iconUrl: '{BASE_URL}/apps/smtp/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/smtp/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '2DAAE1',
  auth,
  actions,
});
