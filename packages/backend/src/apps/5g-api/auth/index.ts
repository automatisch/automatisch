import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';
// import refreshToken from './refresh-token';

export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'privateKey',
      label: 'Private Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Private Key of your High Mobility OAuth app.',
      clickToCopy: false,
    },
    {
      key: 'applicationId',
      label: 'Application ID',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'App ID of your High Mobility OAuth app.',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  // isStillVerified,
  // refreshToken,
};
