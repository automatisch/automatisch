import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import triggers from './triggers';

export default defineApp({
  name: 'Twitter',
  key: 'twitter',
  iconUrl: '{BASE_URL}/apps/twitter/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/twitter/connection',
  supportsConnections: true,
  baseUrl: 'https://twitter.com',
  apiBaseUrl: 'https://api.twitter.com',
  primaryColor: '1da1f2',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
});
