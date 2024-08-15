import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Subscriber created',
  key: 'subscriberCreated',
  type: 'webhook',
  description: 'Triggers when a new subscriber is added to your mailing list.',

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
      sent: null,
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
      status: 'active',
      optin_ip: null,
      forget_at: null,
      open_rate: 0,
      click_rate: 0,
      created_at: new Date().toISOString(),
      deleted_at: null,
      ip_address: null,
      updated_at: new Date().toISOString(),
      opens_count: null,
      opted_in_at: null,
      clicks_count: null,
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
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
      events: ['subscriber.created'],
      url: $.webhookUrl,
    };

    const { data } = await $.http.post('/webhooks', payload);

    await $.flow.setRemoteWebhookId(data.data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/webhooks/${$.flow.remoteWebhookId}`);
  },
});
