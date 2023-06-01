import defineTrigger from '../../../../helpers/define-trigger';
import newFormResponses from './new-form-responses';

export default defineTrigger({
  name: 'New form responses',
  key: 'newFormResponses',
  pollInterval: 15,
  description: 'Triggers when a new form response is submitted.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
      type: 'dropdown' as const,
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
