import defineTrigger from '../../../../helpers/define-trigger.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { sampleInboundMessageEvent } from '../../common/sample-events.js';
import {
  buildTriggerItem,
  getTestRunEvent,
} from '../../common/trigger-items.js';
import { buildWebhookSubscription } from '../../common/webhook-events.js';
import {
  registerWebhook,
  unregisterWebhook,
} from '../../common/webhook-subscription.js';

const INBOUND_EVENT = 'message.received';

export default defineTrigger({
  name: 'New message received',
  key: 'newMessageReceived',
  type: 'webhook',
  description:
    'Triggers when a contact sends a message to one of your Sent numbers on SMS, WhatsApp or RCS.',
  arguments: [senderProfileArgument],

  async run($) {
    const event = $.request.body;

    if (event?.event !== INBOUND_EVENT) return;

    $.pushTriggerItem(buildTriggerItem(event));
  },

  async testRun($) {
    const event = await getTestRunEvent($, sampleInboundMessageEvent);

    $.pushTriggerItem(buildTriggerItem(event));
  },

  async registerHook($) {
    await registerWebhook($, buildWebhookSubscription([INBOUND_EVENT]));
  },

  async unregisterHook($) {
    await unregisterWebhook($);
  },
});
