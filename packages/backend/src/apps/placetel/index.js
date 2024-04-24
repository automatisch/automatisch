import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Placetel',
  key: 'placetel',
  iconUrl: '{BASE_URL}/apps/placetel/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/placetel/connection',
  supportsConnections: true,
  baseUrl: 'https://placetel.de',
  apiBaseUrl: 'https://api.placetel.de',
  primaryColor: '069dd9',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
