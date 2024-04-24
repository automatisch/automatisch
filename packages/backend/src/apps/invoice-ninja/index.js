import defineApp from '../../helpers/define-app.js';
import setBaseUrl from './common/set-base-url.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Invoice Ninja',
  key: 'invoice-ninja',
  baseUrl: 'https://invoiceninja.com',
  apiBaseUrl: 'https://invoicing.co/api',
  iconUrl: '{BASE_URL}/apps/invoice-ninja/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/invoice-ninja/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
