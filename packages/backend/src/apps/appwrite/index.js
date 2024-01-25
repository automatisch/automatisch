import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'Appwrite',
  key: 'appwrite',
  baseUrl: 'https://appwrite.io',
  apiBaseUrl: 'https://cloud.appwrite.io',
  iconUrl: '{BASE_URL}/apps/appwrite/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/appwrite/connection',
  primaryColor: 'FD366E',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
});
