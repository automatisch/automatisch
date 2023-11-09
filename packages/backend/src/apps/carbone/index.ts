import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Carbone',
  key: 'carbone',
  iconUrl: '{BASE_URL}/apps/carbone/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/carbone/connection',
  supportsConnections: true,
  baseUrl: 'https://carbone.io',
  apiBaseUrl: 'https://api.carbone.io',
  primaryColor: '6f42c1',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
