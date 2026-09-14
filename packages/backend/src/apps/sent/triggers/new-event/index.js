import defineTrigger from '../../../../helpers/define-trigger.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { sampleOutboundMessageEvent } from '../../common/sample-events.js';
import {
  buildTriggerItem,
  getTestRunEvent,
} from '../../common/trigger-items.js';
import {
  buildWebhookSubscription,
  eventTypeOptions,
} from '../../common/webhook-events.js';
import {
  registerWebhook,
  unregisterWebhook,
} from '../../common/webhook-subscription.js';

const getSelectedEvents = (parameters) =>
  (parameters.eventTypes ?? [])
    .map((entry) => entry?.eventType)
    .filter(Boolean);

export default defineTrigger({
  name: 'New event',
  key: 'newEvent',
  type: 'webhook',
  description:
    'Triggers when Sent reports a message lifecycle event (queued, sent, delivered, read, failed, blocked, received and more) or a template status change.',
  arguments: [
    senderProfileArgument,
    {
      label: 'Event Types',
      key: 'eventTypes',
      type: 'dynamic',
      required: true,
      description:
        'Events to subscribe to. "All message events" covers every message event.',
      value: [{ eventType: 'message' }],
      fields: [
        {
          label: 'Event type',
          key: 'eventType',
          type: 'dropdown',
          required: true,
          variables: false,
          value: 'message',
          options: eventTypeOptions,
        },
      ],
    },
  ],

  async run($) {
    $.pushTriggerItem(buildTriggerItem($.request.body));
  },

  async testRun($) {
    const event = await getTestRunEvent($, sampleOutboundMessageEvent);

    $.pushTriggerItem(buildTriggerItem(event));
  },

  async registerHook($) {
    const subscription = buildWebhookSubscription(
      getSelectedEvents($.step.parameters)
    );

    await registerWebhook($, subscription);
  },

  async unregisterHook($) {
    await unregisterWebhook($);
  },
});
