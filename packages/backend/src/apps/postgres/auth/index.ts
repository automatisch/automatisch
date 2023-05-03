import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
    fields: [
      {
        key: 'version',
        label: 'Postgres Version',
        type: 'string' as const,
        required: true,
        readOnly: false,
        value: null,
        placeholder: null,
        description:
          'The version of postgres database that user want to connect with.',
        clickToCopy: false,
      },
      {
        key: 'host',
        label: 'Host',
        type: 'string' as const,
        required: true,
        readOnly: false,
        value: null,
        placeholder: null,
        description:
          'The host of postgres database.',
        clickToCopy: false,
      },
      {
        key: 'port',
        label: 'Port',
        type: 'string' as const,
        required: true,
        readOnly: false,
        value: null,
        placeholder: null,
        description:
          'The port of postgres database.',
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
        description:
          'The name of postgres database.',
        clickToCopy: false,
      },
      {
        key: 'user',
        label: 'Database User Name',
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
        description:
          'The password of the user.',
        clickToCopy: false,
      },

    ],

    verifyCredentials,
    isStillVerified    
  };

  
