import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';

export default defineApp({
  name: 'Reddit',
  key: 'reddit',
  baseUrl: 'https://www.reddit.com',
  apiBaseUrl: 'https://oauth.reddit.com',
  iconUrl: '{BASE_URL}/apps/reddit/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/reddit/connection',
  primaryColor: 'FF4500',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
});
