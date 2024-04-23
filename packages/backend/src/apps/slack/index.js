import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import actions from './actions/index.js';
import auth from './auth/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Slack',
  key: 'slack',
  iconUrl: '{BASE_URL}/apps/slack/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/slack/connection',
  supportsConnections: true,
  baseUrl: 'https://slack.com',
  apiBaseUrl: 'https://slack.com/api',
  primaryColor: '4a154b',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});
