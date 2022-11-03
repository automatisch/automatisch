import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import actions from './actions';
import auth from './auth';
import data from './data';

export default defineApp({
  name: 'Slack',
  key: 'slack',
  iconUrl: '{BASE_URL}/apps/slack/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/slack/connection',
  supportsConnections: true,
  baseUrl: 'https://slack.com',
  apiBaseUrl: 'https://slack.com/api',
  primaryColor: '4a154b',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  data,
});
