import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'GitHub',
  key: 'github',
  baseUrl: 'https://github.com',
  apiBaseUrl: 'https://api.github.com',
  iconUrl: '{BASE_URL}/apps/github/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/github/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
