import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New users',
  key: 'newUsers',
  type: 'webhook',
  description: 'Triggers upon the creation of a new user.',

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
    const params = {
      query: 'type:user',
      sort_by: 'created_at',
      sort_order: 'desc',
    };

    const response = await $.http.get('/api/v2/search', { params });

    const lastUser = response.data.results[0];

    const computedWebhookEvent = {
      id: Crypto.randomUUID(),
      time: lastUser.created_at,
      type: 'zen:event-type:user.created',
      event: {},
      detail: {
        id: lastUser.id,
        role: lastUser.role,
        email: lastUser.email,
        created_at: lastUser.created_at,
        updated_at: lastUser.updated_at,
        external_id: lastUser.external_id,
        organization_id: lastUser.organization_id,
        default_group_id: lastUser.default_group_id,
      },
      subject: `zen:user:${lastUser.id}`,
      account_id: '',
      zendesk_event_version: '2022-11-06',
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
      webhook: {
        name: `Flow ID: ${$.flow.id}`,
        status: 'active',
        subscriptions: ['zen:event-type:user.created'],
        endpoint: $.webhookUrl,
        http_method: 'POST',
        request_format: 'json',
      },
    };

    const response = await $.http.post('/api/v2/webhooks', payload);
    const id = response.data.webhook.id;

    await $.flow.setRemoteWebhookId(id);
  },

  async unregisterHook($) {
    await $.http.delete(`/api/v2/webhooks/${$.flow.remoteWebhookId}`);
  },
});
