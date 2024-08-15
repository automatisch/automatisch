import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Trello',
  key: 'trello',
  baseUrl: 'https://trello.com/',
  apiBaseUrl: 'https://api.trello.com',
  iconUrl: '{BASE_URL}/apps/trello/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/trello/connection',
  supportsConnections: true,
  primaryColor: '0079bf',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
