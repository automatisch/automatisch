import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'New chat',
  key: 'newChat',
  description: 'Create a new chat session for Helix AI.',
  arguments: [
    {
      label: 'Input',
      key: 'input',
      type: 'string',
      required: true,
      description: 'Prompt to start the chat with.',
      variables: true,
    },
  ],

  async run($) {
    const response = await $.http.post('/api/v1/sessions/chat', {
      session_id: '',
      messages: [
        {
          role: 'user',
          content: {
            content_type: 'text',
            parts: [$.step.parameters.input],
          },
        },
      ],
    });

    $.setActionItem({
      raw: response.data,
    });
  },
});
