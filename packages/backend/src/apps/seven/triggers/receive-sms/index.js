import defineTrigger from '../../../../helpers/define-trigger.js';
import Crypto from 'node:crypto'

export default defineTrigger({
  arguments: [
    {
      description: 'The number to receive the SMS for. It should be a seven number.',
      key: 'toNumber',
      label: 'To Number',
      required: false,
      type: 'string',
    },
  ],
  description: 'Triggers when a new SMS is received.',
  key: 'receiveSms',
  name: 'Receive SMS',
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
        id: Crypto.randomUUID(),
        message_type: 'SMS',
        sender: 'SMS',
        system: '491771783130',
        text: 'Hello World',
        time: '1605878104',
      },
      webhook_event: 'sms_mo',
      webhook_timestamp: '2020-12-02 11:55:44'
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
      event_type: 'sms_mo',
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
