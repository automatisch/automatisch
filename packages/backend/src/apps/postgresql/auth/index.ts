import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'version',
      label: 'PostgreSQL version',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'The version of PostgreSQL database that user want to connect with.',
      clickToCopy: false,
    },
    {
      key: 'host',
      label: 'Host',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: '127.0.0.1',
      placeholder: null,
      clickToCopy: false,
    },
    {
      key: 'port',
      label: 'Port',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: '5432',
      placeholder: null,
      clickToCopy: false,
    },
    {
      key: 'database',
      label: 'Database Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      clickToCopy: false,
    },
    {
      key: 'user',
      label: 'Database username',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'The user who has access on postgres database.',
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
      clickToCopy: false,
    },

  ],

  verifyCredentials,
  isStillVerified
};
