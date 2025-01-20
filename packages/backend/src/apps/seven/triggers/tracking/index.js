import defineTrigger from '../../../../helpers/define-trigger.js';
import Crypto from 'node:crypto'

export default defineTrigger({
  arguments: [
    {
      description: 'The number to receive the tracking events for. It should be a seven number.',
      key: 'toNumber',
      label: 'To Number',
      required: false,
      type: 'string',
    },
  ],
  description: 'Triggers when a click/view has been registered.',
  key: 'tracking',
  name: 'Tracking',
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
        final_url: 'https://www.google.com',
        sms_id: '77182424125',
        sms_label: null,
        total_clicks: 5,
        total_views: 3,
        tracking_url: 'https://svn.me/7oz',
        type: 'click',
      },
      webhook_event: 'tracking',
      webhook_timestamp: '2022-07-27T07:38:18+02:00',
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
      event_type: 'tracking',
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
