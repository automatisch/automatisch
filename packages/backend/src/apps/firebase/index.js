import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import setBaseUrl from './common/set-base-url.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Firebase',
  key: 'firebase',
  baseUrl: 'https://firebase.google.com',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/firebase/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/firebase/connection',
  primaryColor: 'FFA000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});
