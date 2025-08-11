import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Branches',
  key: 'branches',
  iconUrl: '{BASE_URL}/apps/branches/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/branches/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#4A90E2',
  actions,
});
