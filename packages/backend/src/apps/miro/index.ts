import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Miro',
  key: 'miro',
  baseUrl: 'https://miro.com',
  apiBaseUrl: 'https://api.miro.com',
  iconUrl: '{BASE_URL}/apps/miro/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/miro/connection',
  primaryColor: 'F2CA02',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
