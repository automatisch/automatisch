import verifyCredentials from "./verify-credentials";
import isStillVerified from "./is-still-verified";

export default {
  fields: [
    {
      key: 'secretKey',
      label: 'Secret Key',
      type: 'string' as const,
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
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The display name that identifies this stripe connection - most likely the associated account name',
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified
};