import defineTrigger from '../../../../helpers/define-trigger';
import newItemsInFeed from './new-items-in-feed';

export default defineTrigger({
  name: 'New items in feed',
  key: 'newItemsInFeed',
  description: 'Triggers on new RSS feed items.',
  pollInterval: 15,
  substeps: [
    {
      key: 'chooseTrigger',
      name: 'Set up trigger',
      arguments: [
        {
          label: 'Feed URL',
          key: 'feedUrl',
          type: 'string',
          required: true,
          description: 'Paste your publicly accessible RSS URL here.',
          variables: false,
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await newItemsInFeed($);
  },
});
