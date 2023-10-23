import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Pushover',
  key: 'pushover',
  baseUrl: 'https://pushover.net',
  apiBaseUrl: 'https://api.pushover.net',
  iconUrl: '{BASE_URL}/apps/pushover/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/pushover/connection',
  primaryColor: '249DF1',
  supportsConnections: true,
  auth,
  actions,
  dynamicData,
});
