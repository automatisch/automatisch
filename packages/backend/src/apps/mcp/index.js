import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'MCP',
  key: 'mcp',
  iconUrl: '{BASE_URL}/apps/mcp/assets/favicon.svg',
  docUrl: 'https://automatisch.io/docs/mcp',
  authDocUrl: '{DOCS_URL}/apps/mcp/connection',
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#FF6B35',
  supportsConnections: false,
  enterprise: true,
  actions,
  triggers,
});
