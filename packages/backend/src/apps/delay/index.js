import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Delay',
  key: 'delay',
  iconUrl: '{BASE_URL}/apps/delay/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/delay/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
});
