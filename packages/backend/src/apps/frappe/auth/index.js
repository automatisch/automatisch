import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
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
      key: 'api_key',
      label: 'API Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API key of the Frappe Site.',
      clickToCopy: false,
    },
    {
      key: 'api_secret',
      label: 'API Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API secret of the Frappe Site.',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified
};