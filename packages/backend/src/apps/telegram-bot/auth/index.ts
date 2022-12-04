import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'token',
      label: 'Bot token',
      type: 'string' as const,
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
