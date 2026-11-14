import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Datacircle',
  key: 'datacircle',
  baseUrl: 'https://datacircle.dev',
  apiBaseUrl: 'https://api.datacircle.dev/v1',
  iconUrl: '{BASE_URL}/apps/datacircle/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/datacircle/connection',
  supportsConnections: false,
  primaryColor: '#111111',
  actions,
});
