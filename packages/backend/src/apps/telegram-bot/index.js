import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Telegram',
  key: 'telegram-bot',
  iconUrl: '{BASE_URL}/apps/telegram-bot/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/telegram-bot/connection',
  supportsConnections: true,
  baseUrl: 'https://telegram.org',
  apiBaseUrl: 'https://api.telegram.org',
  primaryColor: '2AABEE',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
