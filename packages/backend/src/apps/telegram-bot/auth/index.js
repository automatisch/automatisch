import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'token',
      label: 'Bot token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Bot token which should be retrieved from @botfather.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
