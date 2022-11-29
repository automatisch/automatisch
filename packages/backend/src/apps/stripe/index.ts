import defineApp from "../../helpers/define-app";
import addAuthHeader from "./common/add-auth-header";
import auth from "./auth"
import triggers from "./triggers"

export default defineApp({
  name: 'Stripe',
  key: 'stripe',
  iconUrl: '{BASE_URL}/apps/stripe/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/stripe/connection',
  supportsConnections: true,
  baseUrl: 'https://stripe.com',
  apiBaseUrl: 'https://api.stripe.com',
  primaryColor: '635bff',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions: [],
})