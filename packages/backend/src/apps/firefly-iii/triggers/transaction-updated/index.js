import Crypto from 'node:crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Transaction updated',
  key: 'transactionUpdated',
  type: 'webhook',
  description: 'Triggers when a transaction is updated.',
  arguments: [],

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

  async registerHook($) {
    const payload = {
      active: true,
      title: `Flow ID: ${$.flow.id}`,
      trigger: 'UPDATE_TRANSACTION',
      response: 'TRANSACTIONS',
      delivery: 'JSON',
      url: $.webhookUrl,
    };

    const response = await $.http.post('/api/v1/webhooks', payload);

    await $.flow.setRemoteWebhookId(response.data.data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/api/v1/webhooks/${$.flow.remoteWebhookId}`);
  },
});
