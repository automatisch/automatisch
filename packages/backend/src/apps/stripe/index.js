import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'Stripe',
  key: 'stripe',
  iconUrl: '{BASE_URL}/apps/stripe/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/stripe/connection',
  supportsConnections: true,
  baseUrl: 'https://stripe.com',
  apiBaseUrl: 'https://api.stripe.com',
  primaryColor: '635bff',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions: [],
});
