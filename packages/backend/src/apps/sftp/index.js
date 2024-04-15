import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'SFTP',
  key: 'sftp',
  iconUrl: '{BASE_URL}/apps/sftp/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/sftp/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '000000',
  auth,
});
