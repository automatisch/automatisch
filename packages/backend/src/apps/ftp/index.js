import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'FTP',
  key: 'ftp',
  iconUrl: '{BASE_URL}/apps/ftp/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/ftp/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '000000',
  auth,
});
