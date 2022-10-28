import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'SMTP',
  key: 'smtp',
  iconUrl: '{BASE_URL}/apps/smtp/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/smtp',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '2DAAE1',
  beforeRequest: [],
  auth,
  actions,
});
