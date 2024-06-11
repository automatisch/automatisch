import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New events',
  key: 'newEvents',
  type: 'webhook',
  description:
    'Triggers when a new event is published and live within an organization.',
  arguments: [
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizations',
          },
        ],
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
    const organizationId = $.step.parameters.organizationId;

    const params = {
      orderBy: 'created_desc',
      status: 'all',
    };

    const {
      data: { events },
    } = await $.http.get(`/v3/organizations/${organizationId}/events/`, params);

    if (events.length === 0) {
      return;
    }

    const computedWebhookEvent = {
      config: {
        action: 'event.published',
        user_id: events[0].organization_id,
        webhook_id: '11111111',
        endpoint_url: $.webhookUrl,
      },
      api_url: events[0].resource_uri,
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: computedWebhookEvent.user_id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const organizationId = $.step.parameters.organizationId;

    const payload = {
      endpoint_url: $.webhookUrl,
      actions: 'event.published',
      event_id: '',
    };

    const { data } = await $.http.post(
      `/v3/organizations/${organizationId}/webhooks/`,
      payload
    );

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/v3/webhooks/${$.flow.remoteWebhookId}/`);
  },
});
