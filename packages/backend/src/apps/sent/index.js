import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Sent',
  key: 'sent',
  iconUrl: '{BASE_URL}/apps/sent/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/sent/connection',
  supportsConnections: true,
  baseUrl: 'https://sent.dm',
  apiBaseUrl: 'https://api.sent.dm',
  primaryColor: '#0b0b0b',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
  dynamicFields,
});
