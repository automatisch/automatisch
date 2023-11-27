import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import dynamicData from './dynamic-data';
import actions from './actions';
import triggers from './triggers';
import dynamicFields from './dynamic-fields';

export default defineApp({
  name: 'Discord',
  key: 'discord',
  iconUrl: '{BASE_URL}/apps/discord/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/discord/connection',
  supportsConnections: true,
  baseUrl: 'https://discord.com',
  apiBaseUrl: 'https://discord.com/api',
  primaryColor: '5865f2',
  beforeRequest: [addAuthHeader],
  auth,
  dynamicData,
  dynamicFields,
  triggers,
  actions,
});
