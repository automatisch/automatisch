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
      key: 'domain',
      label: 'Domain',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'For example: acmeco.od1 if your dashboard url is https://acmeco.od1.vtiger.com. (Unfortunately, we are not able to offer support for self-hosted instances at this moment.)',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
