import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'CAMB AI',
  key: 'camb-ai',
  baseUrl: 'https://camb.ai',
  apiBaseUrl: 'https://client.camb.ai',
  iconUrl: '{BASE_URL}/apps/camb-ai/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/camb-ai/connection',
  primaryColor: '#5111FF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
