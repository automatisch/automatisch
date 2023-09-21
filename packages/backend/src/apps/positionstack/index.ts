import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Positionstack',
  key: 'positionstack',
  iconUrl: '{BASE_URL}/apps/positionstack/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/positionstack/connection',
  supportsConnections: true,
  baseUrl: 'https://positionstack.com',
  apiBaseUrl: 'http://api.positionstack.com/v1',
  primaryColor: '0d2d45',
  auth,
  actions,
});
