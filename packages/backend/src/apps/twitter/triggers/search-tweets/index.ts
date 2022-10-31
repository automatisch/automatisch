import defineTrigger from '../../../../helpers/define-trigger';
import searchTweets from './search-tweets';

export default defineTrigger({
  name: 'Search Tweets',
  key: 'searchTweets',
  pollInterval: 15,
  description:
    'Will be triggered when any user tweet something containing a specific keyword, phrase, username or hashtag.',
  arguments: [
    {
      label: 'Search Term',
      key: 'searchTerm',
      type: 'string' as const,
      required: true,
    },
  ],

  async run($) {
    await searchTweets($);
  },
});
