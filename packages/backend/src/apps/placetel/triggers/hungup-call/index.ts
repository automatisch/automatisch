import Crypto from 'crypto';
import { IJSONObject } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import getRawBody from 'raw-body';

export default defineTrigger({
  name: 'Hungup Call',
  key: 'hungupCall',
  type: 'webhook',
  description: 'Triggers when a call is hungup.',
  arguments: [
    {
      label: 'Types',
      key: 'types',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Type',
          key: 'type',
          type: 'dropdown' as const,
          required: true,
          description:
            'Filter events by type. If the types are not specified, all types will be notified.',
          variables: true,
          options: [
            { label: 'All', value: 'all' },
            { label: 'Voicemail', value: 'voicemail' },
            { label: 'Missed', value: 'missed' },
            { label: 'Blocked', value: 'blocked' },
            { label: 'Accepted', value: 'accepted' },
            { label: 'Busy', value: 'busy' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Unavailable', value: 'unavailable' },
            { label: 'Congestion', value: 'congestion' },
          ],
        },
      ],
    },
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
    const stringBody = await getRawBody($.request, {
      length: $.request.headers['content-length'],
      encoding: true,
    });

    const jsonRequestBody = JSON.parse(stringBody);

    let types = ($.step.parameters.types as IJSONObject[]).map(
      (type) => type.type
    );

    if (types.length === 0) {
      types = ['all'];
    }

    if (types.includes(jsonRequestBody.type) || types.includes('all')) {
      const dataItem = {
        raw: jsonRequestBody,
        meta: {
          internalId: Crypto.randomUUID(),
        },
      };

      $.pushTriggerItem(dataItem);
    }
  },

  async testRun($) {
    const types = ($.step.parameters.types as IJSONObject[]).map(
      (type) => type.type
    );

    const sampleEventData = {
      type: types[0] || 'missed',
      duration: 0,
      from: '01662223344',
      to: '02229997766',
      call_id:
        '9c81d4776d3977d920a558cbd4f0950b168e32bd4b5cc141a85b6ed3aa530107',
      event: 'HungUp',
      direction: 'in',
    };

    const dataItem = {
      raw: sampleEventData,
      meta: {
        internalId: sampleEventData.call_id,
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
