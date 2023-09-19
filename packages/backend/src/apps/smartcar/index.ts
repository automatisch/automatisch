import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Smartcar',
  key: 'smartcar',
  iconUrl: '{BASE_URL}/apps/smartcar/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/smartcar/connection',
  supportsConnections: true,
  baseUrl: 'https://smartcar.com',
  apiBaseUrl: 'https://api.smartcar.com/v2.0',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
