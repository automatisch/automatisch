import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import setBaseUrl from './common/set-base-url.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'SurveyMonkey',
  key: 'surveymonkey',
  baseUrl: 'https://www.surveymonkey.com',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/surveymonkey/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/surveymonkey/connection',
  primaryColor: '00bf6f',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});
