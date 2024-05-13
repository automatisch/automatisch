import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import setBaseUrl from './common/set-base-url.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Changedetection',
  key: 'changedetection',
  iconUrl: '{BASE_URL}/apps/changedetection/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/changedetection/connection',
  supportsConnections: true,
  baseUrl: 'https://changedetection.io',
  apiBaseUrl: '',
  primaryColor: '3056d3',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
  dynamicData,
  triggers,
});
