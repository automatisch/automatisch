import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'PostgreSQL',
  key: 'postgresql',
  iconUrl: '{BASE_URL}/apps/postgresql/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/postgresql/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '336791',
  auth,
  actions,
});
