import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Code',
  key: 'code',
  baseUrl: '',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/code/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/code/connection',
  primaryColor: '000000',
  supportsConnections: false,
  actions,
});
