import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'OneDrive',
  key: 'one-drive',
  baseUrl: 'https://graph.microsoft.com/v1.0',
  apiBaseUrl: 'https://graph.microsoft.com/v1.0',
  iconUrl: '{BASE_URL}/apps/one-drive/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/one-dirve/connection',
  primaryColor: '1FA463',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
