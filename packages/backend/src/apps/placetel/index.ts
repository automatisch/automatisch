import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Placetel',
  key: 'placetel',
  iconUrl: '{BASE_URL}/apps/placetel/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/placetel/connection',
  supportsConnections: true,
  baseUrl: 'https://placetel.de',
  apiBaseUrl: 'https://api.placetel.de',
  primaryColor: '069dd9',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
