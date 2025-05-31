import defineApp from '../../helpers/define-app.js';
import triggers from './triggers/index.ee.js';

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
});
