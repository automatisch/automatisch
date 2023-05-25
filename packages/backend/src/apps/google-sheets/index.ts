import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';
import dynamicData from './dynamic-data';
import dynamicFields from './dynamic-fields';

export default defineApp({
  name: 'Google Sheets',
  key: 'google-sheets',
  baseUrl: 'https://docs.google.com/spreadsheets',
  apiBaseUrl: 'https://sheets.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-sheets/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-sheets/connection',
  primaryColor: '0F9D58',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
  dynamicFields,
});
