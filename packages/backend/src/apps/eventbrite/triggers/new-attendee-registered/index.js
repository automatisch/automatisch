import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New attendee registered',
  key: 'newAttendeeRegistered',
  type: 'webhook',
  description: 'Triggers when an attendee orders a ticket for an event.',
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
    {
      label: 'Event',
      key: 'eventId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listEvents',
          },
          {
            name: 'parameters.organizationId',
            value: '{parameters.organizationId}',
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
    const eventId = $.step.parameters.eventId;
    const organizationId = $.step.parameters.organizationId;

    const params = {
      event_id: eventId,
    };

    const {
      data: { orders },
    } = await $.http.get(`/v3/events/${eventId}/orders/`, params);

    if (orders.length === 0) {
      return;
    }

    const computedWebhookEvent = {
      config: {
        action: 'order.placed',
        user_id: organizationId,
        webhook_id: '11111111',
        endpoint_url: $.webhookUrl,
      },
      api_url: orders[0].resource_uri,
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
    const eventId = $.step.parameters.eventId;

    const payload = {
      endpoint_url: $.webhookUrl,
      actions: 'order.placed',
      event_id: eventId,
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
