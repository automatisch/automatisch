import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'Invoice Ninja',
  key: 'invoice-ninja',
  baseUrl: 'https://invoiceninja.com',
  apiBaseUrl: 'https://invoicing.co/api',
  iconUrl: '{BASE_URL}/apps/invoice-ninja/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/invoice-ninja/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
