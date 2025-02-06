import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from "./actions/index.js";

export default defineApp({
  name: 'Microsoft Outlook',
  key: 'microsoft-outlook',
  baseUrl: 'https://outlook.live.com/',
  apiBaseUrl: 'https://graph.microsoft.com',
  iconUrl: '{BASE_URL}/apps/microsoft-outlook/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/microsoft-outlook/connection',
  primaryColor: '0F6CBD',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});
