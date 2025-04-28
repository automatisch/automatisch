import defineTrigger from '../../../../helpers/define-trigger.js';
import Crypto from 'node:crypto'

export default defineTrigger({
  arguments: [
    {
      description: 'The number to receive the voice calls for. It should be a seven number.',
      key: 'toNumber',
      label: 'To Number',
      required: false,
      type: 'string',
    },
  ],
  description: 'Triggers when a information about voice calls changes.',
  key: 'voiceCall',
  name: 'Voice Call',
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
        caller: '4943160049851',
        id: 0,
        system: '4915170517246',
        time: 1722576539,
      },
      webhook_event: 'voice_call',
      webhook_timestamp: '2024-08-02T07:28:59+02:00',
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
      event_type: 'voice_call',
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
