import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'PostgreSQL DataBase',
  key: 'postgres',
  iconUrl: '{BASE_URL}/apps/thecatapi/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/thecatapi/connection',
  supportsConnections: true,
  baseUrl: '', // https://thecatapi.com
  apiBaseUrl: '', // https://api.thecatapi.com
  primaryColor: '000000',

  auth,
  actions
});
