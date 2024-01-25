import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'projectId',
      label: 'Project ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Project ID of your Appwrite project.',
      clickToCopy: false,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API key of your Appwrite project.',
      clickToCopy: false,
    },
    {
      key: 'instanceUrl',
      label: 'Appwrite instance URL',
      type: 'string',
      required: false,
      readOnly: false,
      placeholder: '',
      description: '',
      clickToCopy: true,
    },
    {
      key: 'host',
      label: 'Host Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Host name of your Appwrite project.',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
