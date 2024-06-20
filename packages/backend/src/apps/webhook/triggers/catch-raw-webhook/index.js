import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Catch raw webhook',
  key: 'catchRawWebhook',
  type: 'webhook',
  showWebhookUrl: true,
  description:
    'Triggers (immediately if configured) when the webhook receives a request.',
  arguments: [
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
  ],

  async run($) {
    const dataItem = {
      raw: {
        headers: $.request.headers,
        body: $.request.body,
        query: $.request.query,
      },
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
