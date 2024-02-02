import defineTrigger from '../../../../helpers/define-trigger.js';
import newFormResponses from './new-form-responses.js';

export default defineTrigger({
  name: 'New form responses',
  key: 'newFormResponses',
  pollInterval: 15,
  description: 'Triggers when a new form response is submitted.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
      type: 'dropdown',
      required: true,
      description: 'Pick a form to receive form responses.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listForms',
          },
        ],
      },
    },
  ],

  async run($) {
    await newFormResponses($);
  },
});
