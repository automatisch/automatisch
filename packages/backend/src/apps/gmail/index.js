import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
export default defineApp({
  name: 'Gmail',
  key: 'gmail',
  baseUrl: 'https://mail.google.com',
  apiBaseUrl: 'https://gmail.googleapis.com',
  iconUrl: '{BASE_URL}/apps/gmail/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/gmail/connection',
  primaryColor: 'ea4335',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
