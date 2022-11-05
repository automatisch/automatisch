import defineApp from '../../helpers/define-app';
import triggers from './triggers';

export default defineApp({
  name: 'Scheduler',
  key: 'scheduler',
  iconUrl: '{BASE_URL}/apps/scheduler/assets/favicon.svg',
  docUrl: 'https://automatisch.io/docs/scheduler',
  authDocUrl: 'https://automatisch.io/docs/apps/scheduler/connection',
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '0059F7',
  supportsConnections: false,
  triggers,
});
