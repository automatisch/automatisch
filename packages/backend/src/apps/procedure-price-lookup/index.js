import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Procedure Price Lookup',
  key: 'procedure-price-lookup',
  iconUrl: '{BASE_URL}/apps/procedure-price-lookup/assets/favicon.svg',
  authDocUrl: '',
  supportsConnections: true,
  baseUrl: 'https://www.medicare.gov/api/procedure-price-lookup/mce/api/v1',
  apiBaseUrl: 'https://www.medicare.gov/api/procedure-price-lookup/mce/api/v1',
  primaryColor: '#6f42c1',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
