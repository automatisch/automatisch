import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create draft reply',
  key: 'createReply',
  description:
    'Create a draft message to reply to an existing mail. The draft will be saved to the drafts folder.',
  arguments: [
    {
      label: 'Email ID',
      key: 'emailId',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'Body of the email.',
      variables: true,
    },
  ],

  async run($) {
    const body = {
      'body': {
        'content': $.step.parameters.body,
        'contentType': 'HTML'
      }
    };

    const reply = await $.http.post(`/v1.0/me/messages/${$.step.parameters.emailId}/createReply`, {},
      {
        headers: {
          'Content-type': 'application/json',
        }
      }
    );
    const {data} = await $.http.patch(
      `/v1.0/me/messages/${reply.data.id}`,
      body,
      {
        headers: {
          'Content-type': 'application/json',
        }
      }
    )

    $.setActionItem({
      raw: data,
    });
  },
});
