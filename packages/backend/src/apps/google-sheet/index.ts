import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Google Sheet',
  key: 'google-sheet',
  baseUrl: 'https://docs.google.com/spreadsheets',
  apiBaseUrl: 'https://sheets.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-sheet/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-sheet/connection',
  primaryColor: '0F9D58',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
