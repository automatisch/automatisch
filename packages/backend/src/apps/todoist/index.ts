import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Todoist',
  key: 'todoist',
  iconUrl: '{BASE_URL}/apps/todoist/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/todoist/connection',
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
