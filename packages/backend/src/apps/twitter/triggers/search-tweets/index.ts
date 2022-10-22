import defineTrigger from '../../../../helpers/define-trigger';
import searchTweets from './search-tweets';

export default defineTrigger({
  name: 'Search Tweets',
  key: 'searchTweets',
  pollInterval: 15,
  description:
    'Will be triggered when any user tweet something containing a specific keyword, phrase, username or hashtag.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Search Term',
          key: 'searchTerm',
          type: 'string',
          required: true,
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await searchTweets($);
  },

  sort(tweet, nextTweet) {
    return Number(nextTweet.meta.internalId) - Number(tweet.meta.internalId);
  },
});
