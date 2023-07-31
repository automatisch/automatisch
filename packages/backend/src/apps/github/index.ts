import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'GitHub',
  key: 'github',
  baseUrl: 'https://github.com',
  apiBaseUrl: 'https://api.github.com',
  iconUrl: '{BASE_URL}/apps/github/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/github/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
