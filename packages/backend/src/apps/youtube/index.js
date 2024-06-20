import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Youtube',
  key: 'youtube',
  baseUrl: 'https://www.youtube.com/',
  apiBaseUrl: 'https://www.googleapis.com/youtube',
  iconUrl: '{BASE_URL}/apps/youtube/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/youtube/connection',
  primaryColor: 'FF0000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
