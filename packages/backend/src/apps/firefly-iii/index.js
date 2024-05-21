import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import setBaseUrl from './common/set-base-url.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Firefly III',
  key: 'firefly-iii',
  baseUrl: '',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/firefly-iii/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/firefly-iii/connection',
  primaryColor: 'CD5029',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
});
