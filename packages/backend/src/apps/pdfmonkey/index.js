import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'PDFMonkey',
  key: 'pdfmonkey',
  iconUrl: '{BASE_URL}/apps/pdfmonkey/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/pdfmonkey/connection',
  supportsConnections: true,
  baseUrl: 'https://pdfmonkey.io',
  apiBaseUrl: 'https://api.pdfmonkey.io/api',
  primaryColor: '#DB2777',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
  dynamicFields,
});
