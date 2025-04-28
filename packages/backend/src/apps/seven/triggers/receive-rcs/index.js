import defineTrigger from '../../../../helpers/define-trigger.js';
import Crypto from 'node:crypto'

export default defineTrigger({
  arguments: [
    {
      description: 'The number to receive the RCS events for. It should be a seven number.',
      key: 'toNumber',
      label: 'To Number',
      required: false,
      type: 'string',
    },
  ],
  description: 'Triggers when a new RCS message/event is received.',
  key: 'receiveRcs',
  name: 'Receive RCS',
  type: 'webhook',
  async run($) {
    const {body} = $.request
    const dataItem = {
      raw: body,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const sampleEventData = {
      data: {
        agent_id: 'myfancyagent',
        content_type: 'text',
        id: 1871353,
        message_type: 'RCS',
        sender: '4915153952979',
        text: 'Hello',
        time: '1709870553',
      },
      webhook_event: 'rcs',
      webhook_timestamp: '2024-03-08T09:47:12+01:00',
    }

    $.pushTriggerItem({
      meta: {
        internalId: sampleEventData.data.id,
      },
      raw: sampleEventData,
    });
  },

  async registerHook($) {
    const body = {
      event_filter: $.step.parameters.toNumber,
      event_type: 'rcs',
      request_method: 'JSON',
      target_url: $.webhookUrl,
    }
    const res = await $.http.post('/hooks', body);

    await $.flow.setRemoteWebhookId(res.data?.id?.toString());
  },

  async unregisterHook($) {
    await $.http.delete(`/hooks?id=${$.flow.remoteWebhookId}`);
  },
});
