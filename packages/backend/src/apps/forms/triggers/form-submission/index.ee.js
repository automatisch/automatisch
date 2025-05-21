import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New form submission',
  key: 'newFormSubmission',
  pollInterval: 15,
  type: 'webhook',
  description: 'Triggers when a new form is submitted.',
  arguments: [
    {
      label: 'Fields',
      key: 'fields',
      type: 'dynamic',
      required: false,
      description: 'Add or remove fields as needed',
      value: [],
      fields: [
        {
          label: 'Field name',
          key: 'fieldName',
          type: 'string',
          required: true,
          description: 'Displayed name to the user',
          variables: true,
        },
        {
          label: 'Type',
          key: 'fieldType',
          type: 'dropdown',
          required: true,
          description: 'Field type',
          variables: true,
          options: [{ label: 'String', value: 'string' }],
        },
      ],
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    }
  },
});
