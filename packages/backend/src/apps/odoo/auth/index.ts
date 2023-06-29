import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'host',
      label: 'Host Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Host name of your Odoo Server',
      clickToCopy: false,
    },
    {
      key: 'port',
      label: 'Port',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: '443',
      placeholder: null,
      description: 'Port that the host is running on, defaults to 443 (HTTPS)',
      clickToCopy: false,
    },
    {
      key: 'databaseName',
      label: 'Database Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Name of your Odoo database',
      clickToCopy: false,
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'string' as const,
      requires: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Email Address of the account that will be interacting with the database',
      clickToCopy: false
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API Key for your Odoo account',
      clickToCopy: false
    }
  ],

  verifyCredentials,
  isStillVerified
};
