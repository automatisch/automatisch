import defineApp from '../../helpers/define-app';
import setBaseUrl from './common/set-base-url';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Helix',
  key: 'helix',
  baseUrl: 'https://tryhelix.ai',
  apiBaseUrl: 'https://app.tryhelix.ai',
  iconUrl: '{BASE_URL}/apps/helix/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/helix/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
});
