import defineApp from '../../helpers/define-app';

export default defineApp({
  name: 'SMTP',
  key: 'smtp',
  iconUrl: '{BASE_URL}/apps/smtp/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/connections/smtp',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '2DAAE1',
  beforeRequest: [],
});
