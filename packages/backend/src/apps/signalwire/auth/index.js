import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'accountSid',
      label: 'Project ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Log into your SignalWire account and find the Project ID',
      clickToCopy: false,
    },
    {
      key: 'authToken',
      label: 'API Token',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API Token in the respective project',
      clickToCopy: false,
    },
    {
      key: 'spaceRegion',
      label: 'SignalWire Region',
      type: 'dropdown',
      required: true,
      readOnly: false,
      value: '',
      placeholder: null,
      description: 'Most people should choose the default, "US"',
      clickToCopy: false,
      options: [
        {
          label: 'US',
          value: '',
        },
        {
          label: 'EU',
          value: 'eu-',
        },
      ],
    },
    {
      key: 'spaceName',
      label: 'Space Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Name of your SignalWire space that contains the project',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
