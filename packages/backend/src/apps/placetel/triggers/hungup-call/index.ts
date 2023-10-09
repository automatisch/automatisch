import Crypto from 'crypto';
import { IJSONObject } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'Hungup Call',
  key: 'hungupCall',
  type: 'webhook',
  description: 'Triggers when a call is hungup.',
  arguments: [
    {
      label: 'Numbers',
      key: 'numbers',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Number',
          key: 'number',
          type: 'dropdown' as const,
          required: true,
          description:
            'Filter events by number. If the numbers are not specified, all numbers will be notified.',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listNumbers',
              },
            ],
          },
        },
      ],
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
    const response = await $.http.get('/v2/calls?order=desc');

    if (!response?.data) {
      return;
    }

    const lastCall = response.data[0];

    const computedWebhookEvent = {
      type: lastCall.type,
      duration: lastCall.duration,
      from: lastCall.from_number,
      to: lastCall.to_number.number.number,
      call_id: lastCall.id.toString(),
      event: 'HungUp',
      direction: 'in',
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: computedWebhookEvent.call_id.toString(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const numbers = ($.step.parameters.numbers as IJSONObject[])
      .map((number: IJSONObject) => number.number)
      .filter(Boolean);

    const subscriptionPayload = {
      service: 'string',
      url: $.webhookUrl,
      incoming: false,
      outgoing: false,
      hungup: true,
      accepted: false,
      phone: false,
      numbers,
    };

    const { data } = await $.http.put('/v2/subscriptions', subscriptionPayload);

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/v2/subscriptions/${$.flow.remoteWebhookId}`);
  },
});
