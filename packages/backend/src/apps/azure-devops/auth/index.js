import isStillVerified from './is-still-verified.js';
import verifyCredentials from './verify-credentials.js';

export default {
  fields: [
    {
      key: 'userEmail',
      label: 'User Email',
      type: 'string',
      description: 'The email of the user to authenticate as.',
      required: true,
      readOnly: false,
    },
    {
      key: 'personalAccessToken',
      label: 'Personal Access Token',
      type: 'string',
      required: true,
      readOnly: false,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
    {
      key: 'organization',
      label: 'Organization',
      type: 'string',
      required: true,
      readOnly: false,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified,
};
