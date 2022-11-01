import defineTrigger from '../../../../helpers/define-trigger';
import newItemsInFeed from './new-items-in-feed';

export default defineTrigger({
  name: 'New items in feed',
  key: 'newItemsInFeed',
  description: 'Triggers on new RSS feed item.',
  pollInterval: 15,
  arguments: [
    {
      label: 'Feed URL',
      key: 'feedUrl',
      type: 'string' as const,
      required: true,
      description: 'Paste your publicly accessible RSS URL here.',
      variables: false,
    },
  ],

  async run($) {
    await newItemsInFeed($);
  },
});
