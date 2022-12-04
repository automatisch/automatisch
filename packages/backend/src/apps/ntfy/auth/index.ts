import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'serverUrl',
      label: 'Server URL',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: 'https://ntfy.sh',
      placeholder: null,
      description: 'ntfy server to use.',
      clickToCopy: false,
    },
    {
      key: 'username',
      label: 'Username',
      type: 'string' as const,
      required: false,
      readOnly: false,
      placeholder: null,
      clickToCopy: false,
    },
    {
      key: 'password',
      label: 'Password',
      type: 'string' as const,
      required: false,
      readOnly: false,
      placeholder: null,
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
