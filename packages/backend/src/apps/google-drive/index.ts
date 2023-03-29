import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Google Drive',
  key: 'google-drive',
  baseUrl: 'https://drive.google.com',
  apiBaseUrl: 'https://www.googleapis.com/drive',
  iconUrl: '{BASE_URL}/apps/google-drive/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-drive/connection',
  primaryColor: '1FA463',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
