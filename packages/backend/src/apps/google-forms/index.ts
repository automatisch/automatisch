import defineApp from '../../helpers/define-app';

export default defineApp({
  name: 'Google Forms',
  key: 'google-forms',
  baseUrl: 'https://docs.google.com/forms',
  apiBaseUrl: 'https://forms.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-forms/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-forms/connection',
  primaryColor: '673AB7',
  supportsConnections: true,
});
