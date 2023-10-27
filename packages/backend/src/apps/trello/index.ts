import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Trello',
  key: 'trello',
  baseUrl: 'https://trello.com/',
  apiBaseUrl: 'https://api.trello.com',
  iconUrl: '{BASE_URL}/apps/trello/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/trello/connection',
  supportsConnections: true,
  primaryColor: '0079bf',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
