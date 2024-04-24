import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import addXRequestedWithHeader from './common/add-x-requested-with-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Mattermost',
  key: 'mattermost',
  iconUrl: '{BASE_URL}/apps/mattermost/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/mattermost/connection',
  baseUrl: 'https://mattermost.com',
  apiBaseUrl: '', // there is no cloud version of this app, user always need to provide address of own instance when creating connection
  primaryColor: '4a154b',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addXRequestedWithHeader, addAuthHeader],
  auth,
  actions,
  dynamicData,
});
