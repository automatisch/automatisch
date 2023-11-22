import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-headers';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Zendesk',
  key: 'zendesk',
  baseUrl: 'https://zendesk.com/',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/zendesk/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/zendesk/connection',
  primaryColor: '17494d',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
