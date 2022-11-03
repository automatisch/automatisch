import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Salesforce',
  key: 'salesforce',
  iconUrl: '{BASE_URL}/apps/salesforce/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/salesforce',
  supportsConnections: true,
  baseUrl: 'https://salesforce.com',
  apiBaseUrl: '',
  primaryColor: '00A1E0',
  beforeRequest: [addAuthHeader],
  auth,
});
