import defineTrigger from '../../../../helpers/define-trigger';
import fetchMessages from './fetch-messages';

export default defineTrigger({
  name: 'Receive SMS',
  key: 'receiveSms',
  pollInterval: 15,
  description: 'Will be triggered when a new SMS is received.',
  arguments: [
    {
      label: 'To Number',
      key: 'toNumber',
      type: 'string',
      required: true,
      description:
        'The number to receive the SMS on. It should be a Twilio number.',
    },
  ],

  async run($) {
    await fetchMessages($);
  },
});
