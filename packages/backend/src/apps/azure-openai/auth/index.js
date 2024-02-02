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
      key: 'yourResourceName',
      label: 'Your Resource Name',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The name of your Azure OpenAI Resource.',
      docUrl: 'https://automatisch.io/docs/azure-openai#your-resource-name',
      clickToCopy: false,
    },
    {
      key: 'deploymentId',
      label: 'Deployment ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The deployment name you chose when you deployed the model.',
      docUrl: 'https://automatisch.io/docs/azure-openai#deployment-id',
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
      description: 'Azure OpenAI API key of your account.',
      docUrl: 'https://automatisch.io/docs/azure-openai#api-key',
      clickToCopy: false,
    },
  ],

  verifyCredentials,
  isStillVerified,
};
