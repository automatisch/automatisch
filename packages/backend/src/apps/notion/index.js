import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import addNotionVersionHeader from './common/add-notion-version-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Notion',
  key: 'notion',
  baseUrl: 'https://notion.com',
  apiBaseUrl: 'https://api.notion.com',
  iconUrl: '{BASE_URL}/apps/notion/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/notion/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader, addNotionVersionHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
