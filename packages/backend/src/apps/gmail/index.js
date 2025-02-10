import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Gmail',
  key: 'gmail',
  baseUrl: 'https://mail.google.com',
  apiBaseUrl: 'https://gmail.googleapis.com',
  iconUrl: '{BASE_URL}/apps/gmail/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/gmail/connection',
  primaryColor: '#ea4335',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});
