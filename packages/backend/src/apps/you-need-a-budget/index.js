import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'You Need A Budget',
  key: 'you-need-a-budget',
  baseUrl: 'https://app.ynab.com',
  apiBaseUrl: 'https://api.ynab.com/v1',
  iconUrl: '{BASE_URL}/apps/you-need-a-budget/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/you-need-a-budget/connection',
  primaryColor: '19223C',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
