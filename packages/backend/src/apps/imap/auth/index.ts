import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'host',
      label: 'Host',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The host information Automatisch will connect to.',
      clickToCopy: false,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your IMAP login credentials.',
      clickToCopy: false,
    },
    {
      key: 'password',
      label: 'Password',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
    {
      key: 'useTLS',
      label: 'Use TLS?',
      type: 'dropdown' as const,
      required: false,
      readOnly: false,
      value: false,
      placeholder: null,
      description: null,
      clickToCopy: false,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    {
      key: 'port',
      label: 'Port',
      type: 'string' as const,
      required: false,
      readOnly: false,
      value: '993',
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
    {
      key: 'sslHostname',
      label: 'SSL Hostname',
      type: 'string' as const,
      required: false,
      readOnly: false,
      placeholder: null,
      description: 'Hostname of the SSL Certificate.',
      clickToCopy: false,
    }
  ],
  verifyCredentials,
  isStillVerified
};
