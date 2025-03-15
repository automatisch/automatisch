import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Iterator',
  key: 'iterator',
  iconUrl: '{BASE_URL}/apps/iterator/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/iterator/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#001F52',
  actions,
});
