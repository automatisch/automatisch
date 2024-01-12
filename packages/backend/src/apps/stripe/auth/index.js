import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'secretKey',
      label: 'Secret Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
    {
      key: 'displayName',
      label: 'Account Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'The display name that identifies this stripe connection - most likely the associated account name',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified,
};
