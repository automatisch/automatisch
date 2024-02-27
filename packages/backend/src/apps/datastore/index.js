import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Datastore',
  key: 'datastore',
  iconUrl: '{BASE_URL}/apps/datastore/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/datastore/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
});
