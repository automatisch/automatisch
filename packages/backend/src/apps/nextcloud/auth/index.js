import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import getInstanceUrl from '../common/get-instance-url.js';

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
      key: 'instanceUrl',
      label: 'NextCloud instance URL',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your NextCloud instance URL.',
      docUrl: 'https://automatisch.io/docs/wordpress#instance-url',
      clickToCopy: true,
    },
    {
      key: 'login',
      label: 'Login',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your NextCloud login',
      clickToCopy: false,
    },
    {
      key: 'password',
      label: 'Password or App Password',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your account password or your app password',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
  getInstanceUrl,
};
