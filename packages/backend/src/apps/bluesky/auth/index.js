import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import refreshToken from './refresh-token.js';

export default {
  fields: [
    {
      key: 'handle',
      label: 'Your Bluesky Handle',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: '',
      clickToCopy: false,
    },
    {
      key: 'password',
      label: 'Your Bluesky Password',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: '',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
  refreshToken,
};
