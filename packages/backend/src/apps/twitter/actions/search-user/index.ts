import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Search user',
  key: 'searchUser',
  description: 'Search a user on Twitter',
  arguments: [
    {
      label: 'Username',
      key: 'username',
      type: 'string' as const,
      required: true,
      description: 'The username of the Twitter user you want to search for',
      variables: true,
    },
  ],

  async run($) {
    const { data } = await $.http.get(`/2/users/by/username/${$.step.parameters.username}`, {
      params: {
        expansions: 'pinned_tweet_id',
        'tweet.fields': 'attachments,author_id,context_annotations,conversation_id,created_at,edit_controls,entities,geo,id,in_reply_to_user_id,lang,non_public_metrics,public_metrics,organic_metrics,promoted_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld',
        'user.fields': 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,verified_type,withheld'
      }
    });
    $.setActionItem({
      raw: data.data
    });
  },
});
