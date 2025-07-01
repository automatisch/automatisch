import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import refreshToken from './refresh-token.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/frappe/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Frappe OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/apps/frappe/connection',
      clickToCopy: true,
    },
    {
      key: 'site_url',
      label: 'Site URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'URL of your Frappe/ERPNext site (e.g. https://mysite.frappe.cloud)',
      clickToCopy: false,
    },
    {
      key: 'consumerKey',
      label: 'Client ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/apps/frappe/connection',
      clickToCopy: false,
    },
    {
      key: 'consumerSecret',
      label: 'Client Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/apps/frappe/connection',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified,
  generateAuthUrl,
  refreshToken,
};
