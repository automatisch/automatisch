import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Spam complaint',
  key: 'spamComplaint',
  type: 'webhook',
  description: 'Triggers when a subscriber reports an email as spam.',

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
      source: '',
      status: 'junk',
      optin_ip: null,
      forget_at: null,
      open_rate: 0,
      click_rate: 0,
      created_at: new Date().toISOString(),
      deleted_at: null,
      ip_address: null,
      updated_at: new Date().toISOString(),
      opens_count: 0,
      opted_in_at: null,
      clicks_count: 0,
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
      events: ['subscriber.spam_reported'],
      url: $.webhookUrl,
    };

    const { data } = await $.http.post('/webhooks', payload);

    await $.flow.setRemoteWebhookId(data.data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/webhooks/${$.flow.remoteWebhookId}`);
  },
});
