import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New form submission',
  key: 'newFormSubmission',
  type: 'webhook',
  description: 'Triggers when a new form is submitted.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
      type: 'dropdown',
      required: true,
      description: 'Form to trigger.',
      variables: true,
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
    {
      label: 'Wait until flow is done',
      key: 'workSynchronously',
      type: 'dropdown',
      required: true,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      label: 'Async redirect URL',
      key: 'asyncRedirectUrl',
      type: 'string',
      required: false,
      description:
        'URL to redirect users to immediately after form submission when not waiting for flow completion. Leave empty to show default success message.',
      variables: true,
      visibleIf: {
        workSynchronously: false,
      },
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
