import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'Catch raw webhook',
  key: 'catchRawWebhook',
  type: 'webhook',
  showWebhookUrl: true,
  description: 'Triggers when the webhook receives a request.',

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
