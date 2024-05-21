import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Transaction deleted',
  key: 'transactionDeleted',
  type: 'webhook',
  description: 'Triggers when a transaction is deleted.',
  arguments: [
    {
      label: 'Title of the webhook',
      key: 'title',
      type: 'string',
      required: false,
      description: '',
      variables: true,
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
    const { data: transactions } = await $.http.get(`/api/v1/transactions`);

    if (transactions.data.length === 0) {
      return;
    }

    const { data: transaction } = await $.http.get(
      `/api/v1/transactions/${transactions.data[0].id}`
    );

    const lastTransaction = transaction.data;

    if (!lastTransaction) {
      return;
    }

    const computedWebhookEvent = {
      url: '',
      uuid: Crypto.randomUUID(),
      content: lastTransaction.attributes,
      trigger: 'DESTROY_TRANSACTION',
      user_id: lastTransaction.attributes.user,
      version: '',
      response: 'TRANSACTIONS',
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: computedWebhookEvent.uuid,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const title = $.step.parameters.title;

    const payload = {
      active: true,
      title: title || `Flow ID: ${$.flow.id}`,
      trigger: 'DESTROY_TRANSACTION',
      response: 'TRANSACTIONS',
      delivery: 'JSON',
      url: $.webhookUrl,
    };

    const response = await $.http.post('/api/v1/webhooks', payload);
    const id = response.data.data.id;

    await $.flow.setRemoteWebhookId(id);
  },

  async unregisterHook($) {
    await $.http.delete(`/api/v1/webhooks/${$.flow.remoteWebhookId}`);
  },
});
