import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Miro',
  key: 'miro',
  baseUrl: 'https://miro.com',
  apiBaseUrl: 'https://api.miro.com',
  iconUrl: '{BASE_URL}/apps/miro/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/miro/connection',
  primaryColor: 'F2CA02',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
