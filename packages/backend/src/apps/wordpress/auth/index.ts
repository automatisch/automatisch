import generateAuthUrl from './generate-auth-url';
import isStillVerified from './is-still-verified';
import verifyCredentials from './verify-credentials';

export default {
  fields: [
    {
      key: 'instanceUrl',
      label: 'WordPress instance URL',
      type: 'string' as const,
      required: false,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your WordPress instance URL.',
      docUrl: 'https://automatisch.io/docs/wordpress#instance-url',
      clickToCopy: true,
    },
  ],

  generateAuthUrl,
  isStillVerified,
  verifyCredentials,
};
