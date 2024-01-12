import generateAuthUrl from './generate-auth-url.js';
import isStillVerified from './is-still-verified.js';
import verifyCredentials from './verify-credentials.js';

export default {
  fields: [
    {
      key: 'instanceUrl',
      label: 'WordPress instance URL',
      type: 'string',
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
