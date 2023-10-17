import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'Youtube',
  key: 'youtube',
  baseUrl: 'https://www.youtube.com/',
  apiBaseUrl: 'https://www.googleapis.com/youtube',
  iconUrl: '{BASE_URL}/apps/youtube/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/youtube/connection',
  primaryColor: 'FF0000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
