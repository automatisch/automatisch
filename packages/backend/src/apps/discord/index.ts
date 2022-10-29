import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import triggers from './triggers';

export default defineApp({
  name: 'Discord',
  key: 'discord',
  iconUrl: '{BASE_URL}/apps/discord/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/discord',
  supportsConnections: true,
  baseUrl: 'https://discord.com',
  apiBaseUrl: 'https://discord.com/api',
  primaryColor: '5865f2',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
});
