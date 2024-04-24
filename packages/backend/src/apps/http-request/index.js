import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'HTTP Request',
  key: 'http-request',
  iconUrl: '{BASE_URL}/apps/http-request/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/http-request/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '000000',
  actions,
});
