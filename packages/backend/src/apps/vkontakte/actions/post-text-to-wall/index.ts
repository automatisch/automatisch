import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Post text to group wall',
  key: 'postTextToWall',
  description: 'Posts text to your group wall',
  arguments: [
    {
      label: 'text',
      key: 'text',
      type: 'string' as const,
      required: true,
      description: 'The text to publish',
      variables: true,
    },
  ],

  async run($) {
    const text = $.step?.parameters.text as string;
    const headers = {
      'Authorization': 'Bearer ' + ($.auth.data.userKey as string),
      'Content-Type': 'multipart/form-data'
    };
    const response = await $.http.get(`/method/wall.post?owner_id=-${$.auth.data.groupId as string}&message=${text}&from_group=1&v=5.131`, {headers});
    $.setActionItem({ raw: response.data });
  },
});