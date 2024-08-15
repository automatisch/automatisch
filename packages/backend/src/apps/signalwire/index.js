import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'SignalWire',
  key: 'signalwire',
  iconUrl: '{BASE_URL}/apps/signalwire/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/signalwire/connection',
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
