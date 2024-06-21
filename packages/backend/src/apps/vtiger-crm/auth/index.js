import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'username',
      label: 'Username',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Email address of your Vtiger CRM account',
      clickToCopy: false,
    },
    {
      key: 'accessKey',
      label: 'Access Key',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Access Key of your Vtiger CRM account',
      clickToCopy: false,
    },
    {
      key: 'instanceUrl',
      label: 'Instance URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: '',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
