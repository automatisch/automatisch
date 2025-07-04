import defineApp from '../../helpers/define-app.js';
import triggers from './triggers/index.ee.js';
import actions from './actions/index.ee.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Forms',
  key: 'forms',
  iconUrl: '{BASE_URL}/apps/forms/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/forms/connection',
  supportsConnections: false,
  enterprise: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#0059F7',
  triggers,
  actions,
  dynamicData,
});
