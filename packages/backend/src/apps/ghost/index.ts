import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'Ghost',
  key: 'ghost',
  baseUrl: 'https://ghost.org',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/ghost/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/ghost/connection',
  primaryColor: '15171A',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
});
