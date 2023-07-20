import defineApp from '../../helpers/define-app';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'IMAP',
  key: 'imap',
  iconUrl: '{BASE_URL}/apps/imap/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/imap/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '',
  auth,
  triggers,
});
