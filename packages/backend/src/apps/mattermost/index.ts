import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import addXRequestedWithHeader from './common/add-x-requested-with-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Mattermost',
  key: 'mattermost',
  iconUrl: '{BASE_URL}/apps/mattermost/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/mattermost/connection',
  baseUrl: 'https://mattermost.com',
  apiBaseUrl: '', // there is no cloud version of this app, user always need to provide address of own instance when creating connection
  primaryColor: '4a154b',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addXRequestedWithHeader, addAuthHeader],
  auth,
  actions,
  dynamicData,
});
