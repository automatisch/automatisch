import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Google Drive',
  key: 'google-drive',
  baseUrl: 'https://drive.google.com',
  apiBaseUrl: 'https://www.googleapis.com/drive',
  iconUrl: '{BASE_URL}/apps/google-drive/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-drive/connection',
  primaryColor: '1FA463',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
