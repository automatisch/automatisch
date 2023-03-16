import defineTrigger from '../../../../helpers/define-trigger';
import fetchMessages from './fetch-messages';

export default defineTrigger({
  name: 'Receive SMS',
  key: 'receiveSms',
  pollInterval: 15,
  description: 'Triggers when a new SMS is received.',
  arguments: [
    {
      label: 'To Number',
      key: 'toNumber',
      type: 'dropdown',
      required: true,
      description:
        'The number to receive the SMS on. It should be a SignalWire number in your project.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listIncomingPhoneNumbers',
          },
        ],
      },
    },
  ],

  async run($) {
    await fetchMessages($);
  },
});
