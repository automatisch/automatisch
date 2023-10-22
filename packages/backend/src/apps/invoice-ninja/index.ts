import defineApp from '../../helpers/define-app';
import setBaseUrl from './common/set-base-url';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Invoice Ninja',
  key: 'invoice-ninja',
  baseUrl: 'https://invoiceninja.com',
  apiBaseUrl: 'https://invoicing.co/api',
  iconUrl: '{BASE_URL}/apps/invoice-ninja/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/invoice-ninja/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
