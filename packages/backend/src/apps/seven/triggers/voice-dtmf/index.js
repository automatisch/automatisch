import defineTrigger from '../../../../helpers/define-trigger.js';
import Crypto from 'node:crypto'

export default defineTrigger({
  arguments: [
    {
      description: 'The number to receive the DTMF information for. It should be a seven number.',
      key: 'toNumber',
      label: 'To Number',
      required: false,
      type: 'string',
    },
  ],
  description: 'Triggers on incoming DTMF signals in voice calls.',
  key: 'voiceDtmf',
  name: 'Voice DTMF',
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
        callerId: '4943160049851',
        dtmf_digit: 9,
        duration: 2.76,
        id: 0,
        pricePerMinute: 0.045,
        recipient: '4943160049851',
        status: 'completed',
        system: '4915170517246',
        timestamp: 1722576539,
        total_price: 0.045,
      },
      webhook_event: 'voice_dtmf',
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
      event_type: 'voice_dtmf',
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
