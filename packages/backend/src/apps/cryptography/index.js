import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Cryptography',
  key: 'cryptography',
  iconUrl: '{BASE_URL}/apps/cryptography/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/cryptography/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
});
