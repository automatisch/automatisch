import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';
import triggers from './triggers/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Discord',
  key: 'discord',
  iconUrl: '{BASE_URL}/apps/discord/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/discord/connection',
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
