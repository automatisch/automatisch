import verifyCredentials from "./verify-credentials";
import isStillVerified from "./is-still-verified";

export default {
  fields: [
    {
      key: 'accessToken',
      label: 'Access Token',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      clickToCopy: false,
    },
  ],
  verifyCredentials,
  isStillVerified
};
