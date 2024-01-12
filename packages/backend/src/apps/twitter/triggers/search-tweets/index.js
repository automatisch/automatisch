import defineTrigger from '../../../../helpers/define-trigger.js';
import searchTweets from './search-tweets.js';

export default defineTrigger({
  name: 'Search tweets',
  key: 'searchTweets',
  pollInterval: 15,
  description:
    'Triggers when there is a new tweet containing a specific keyword, phrase, username or hashtag.',
  arguments: [
    {
      label: 'Search Term',
      key: 'searchTerm',
      type: 'string',
      required: true,
    },
  ],

  async run($) {
    await searchTweets($);
  },
});
