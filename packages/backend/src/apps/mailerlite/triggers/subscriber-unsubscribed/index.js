import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Subscriber unsubscribed',
  key: 'subscriberUnsubscribed',
  type: 'webhook',
  description:
    'Triggers when a subscriber has unsubscribed from your mailing list.',

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
      sent: 1,
      email: 'user@automatisch.io',
      fields: {
        city: 'City',
        name: 'Name',
        phone: '',
        state: 'State',
        z_i_p: null,
        company: 'Company',
        country: 'Country',
        last_name: 'Last Name',
      },
      source: 'manual',
      status: 'unsubscribed',
      optin_ip: null,
      forget_at: null,
      open_rate: 100,
      click_rate: 0,
      created_at: new Date().toISOString(),
      deleted_at: null,
      ip_address: null,
      updated_at: new Date().toISOString(),
      opens_count: 1,
      opted_in_at: null,
      clicks_count: 0,
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: new Date().toISOString(),
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
      events: ['subscriber.unsubscribed'],
      url: $.webhookUrl,
    };

    const { data } = await $.http.post('/webhooks', payload);

    await $.flow.setRemoteWebhookId(data.data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/webhooks/${$.flow.remoteWebhookId}`);
  },
});
