import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Airtable',
  key: 'airtable',
  baseUrl: 'https://airtable.com',
  apiBaseUrl: 'https://api.airtable.com',
  iconUrl: '{BASE_URL}/apps/airtable/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/airtable/connection',
  primaryColor: 'FFBF00',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});
