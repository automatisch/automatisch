import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

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
        'Name your connection (only used for Automatisch UI).',
      clickToCopy: false,
    },
    {
      key: 'apiToken',
      label: 'API Token',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Your Todoist API token. See https://todoist.com/app/settings/integrations/developer',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
