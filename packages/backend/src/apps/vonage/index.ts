import defineApp from '../../helpers/define-app';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';

export default defineApp({
  name: 'Vonage',
  key: 'vonage',
  iconUrl: '{BASE_URL}/apps/vonage/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/vonage/connection',
  supportsConnections: true,
  baseUrl: 'https://vonage.com',
  apiBaseUrl: 'https://messages-sandbox.nexmo.com/v1',
  primaryColor: '000000',
  auth,
  triggers,
  actions,
});
