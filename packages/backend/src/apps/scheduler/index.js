import defineApp from '../../helpers/define-app.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Scheduler',
  key: 'scheduler',
  iconUrl: '{BASE_URL}/apps/scheduler/assets/favicon.svg',
  docUrl: 'https://automatisch.io/docs/scheduler',
  authDocUrl: '{DOCS_URL}/apps/scheduler/connection',
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '0059F7',
  supportsConnections: false,
  triggers,
});
