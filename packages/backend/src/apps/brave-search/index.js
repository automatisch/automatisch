import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import addAcceptHeader from './common/add-accept-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Brave Search',
  key: 'brave-search',
  baseUrl: 'https://search.brave.com',
  apiBaseUrl: 'https://api.search.brave.com/res',
  iconUrl: '{BASE_URL}/apps/brave-search/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/brave-search/connection',
  primaryColor: '#181818',
  supportsConnections: true,
  beforeRequest: [addAuthHeader, addAcceptHeader],
  auth,
  actions,
  dynamicData,
});
