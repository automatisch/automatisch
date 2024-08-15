import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'DeepL',
  key: 'deepl',
  iconUrl: '{BASE_URL}/apps/deepl/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/deepl/connection',
  supportsConnections: true,
  baseUrl: 'https://deepl.com',
  apiBaseUrl: 'https://api.deepl.com',
  primaryColor: '0d2d45',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
