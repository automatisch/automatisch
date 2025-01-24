import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Microsoft SQL Server',
  key: 'mssql',
  iconUrl: '{BASE_URL}/apps/mssql/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/mssql/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#CC2927',
  auth,
  actions,
});
