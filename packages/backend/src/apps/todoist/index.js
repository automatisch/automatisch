import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Todoist',
  key: 'todoist',
  iconUrl: '{BASE_URL}/apps/todoist/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/todoist/connection',
  supportsConnections: true,
  baseUrl: 'https://todoist.com',
  apiBaseUrl: 'https://api.todoist.com/rest/v2',
  primaryColor: 'e44332',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
