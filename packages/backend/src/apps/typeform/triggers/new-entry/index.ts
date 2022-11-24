import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New entry',
  key: 'newEntry',
  pollInterval: 15,
  description: 'Triggers when a new form submitted.',
  arguments: [
    {
      label: 'Form',
      key: 'form',
      type: 'dropdown' as const,
      required: true,
      description: 'Pick a form to receive submissions.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listForms',
          },
        ],
      },
    },
  ],

  async run($) {
    // await getUserTweets($, { currentUser: true });
  },
});
