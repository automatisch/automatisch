import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Ntfy',
  key: 'ntfy',
  iconUrl: '{BASE_URL}/apps/ntfy/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/ntfy/connection',
  supportsConnections: true,
  baseUrl: 'https://ntfy.sh',
  apiBaseUrl: 'https://ntfy.sh',
  primaryColor: '56bda8',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
