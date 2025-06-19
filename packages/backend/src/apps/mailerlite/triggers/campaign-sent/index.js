import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Campaign sent',
  key: 'campaignSent',
  type: 'webhook',
  description: 'Triggers when a campaign has been activated.',

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
    const computedWebhookEvent = {
      id: Crypto.randomUUID(),
      date: new Date().toISOString(),
      name: 'Name',
      preview_url: '',
      total_recipients: 1,
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: computedWebhookEvent.id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const payload = {
      name: $.flow.id,
      events: ['campaign.sent'],
      url: $.webhookUrl,
    };

    const { data } = await $.http.post('/webhooks', payload);

    await $.flow.setRemoteWebhookId(data.data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/webhooks/${$.flow.remoteWebhookId}`);
  },
});
