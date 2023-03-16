import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'SignalWire',
  key: 'signalwire',
  iconUrl: '{BASE_URL}/apps/signalwire/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/signalwire/connection',
  supportsConnections: true,
  baseUrl: 'https://signalwire.com',
  apiBaseUrl: '',
  primaryColor: '044cf6',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
