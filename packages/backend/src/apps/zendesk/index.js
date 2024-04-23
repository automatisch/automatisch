import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-headers.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Zendesk',
  key: 'zendesk',
  baseUrl: 'https://zendesk.com/',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/zendesk/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/zendesk/connection',
  primaryColor: '17494d',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
