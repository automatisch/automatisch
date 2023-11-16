import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Remove.bg',
  key: 'removebg',
  iconUrl: '{BASE_URL}/apps/removebg/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/removebg/connection',
  supportsConnections: true,
  baseUrl: 'https://www.remove.bg',
  apiBaseUrl: 'https://api.remove.bg/v1.0',
  primaryColor: '55636c',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
