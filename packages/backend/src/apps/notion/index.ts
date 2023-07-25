import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import addNotionVersionHeader from './common/add-notion-version-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Notion',
  key: 'notion',
  baseUrl: 'https://notion.com',
  apiBaseUrl: 'https://api.notion.com',
  iconUrl: '{BASE_URL}/apps/notion/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/notion/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader, addNotionVersionHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
