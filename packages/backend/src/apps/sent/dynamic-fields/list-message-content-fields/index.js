const textField = {
  label: 'Message Text',
  key: 'text',
  type: 'string',
  required: true,
  description: 'Free-form message body.',
  variables: true,
};

const templateField = {
  label: 'Template',
  key: 'templateId',
  type: 'dropdown',
  required: true,
  description:
    'Approved template to send. The template variables appear below once a template is selected.',
  variables: false,
  dependsOn: ['parameters.senderProfileId'],
  source: {
    type: 'query',
    name: 'getDynamicData',
    arguments: [
      {
        name: 'key',
        value: 'listTemplates',
      },
      {
        name: 'parameters.senderProfileId',
        value: '{parameters.senderProfileId}',
      },
    ],
  },
  additionalFields: {
    type: 'query',
    name: 'getDynamicFields',
    arguments: [
      {
        name: 'key',
        value: 'listTemplateParameters',
      },
      {
        name: 'parameters.templateId',
        value: '{parameters.templateId}',
      },
    ],
  },
};

export default {
  name: 'List message content fields',
  key: 'listMessageContentFields',

  async run($) {
    if ($.step.parameters.contentType === 'template') {
      return [templateField];
    }

    return [textField];
  },
};
