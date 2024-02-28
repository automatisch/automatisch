import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'New chat',
  key: 'newChat',
  description: 'Create a new chat session for Helix AI.',
  arguments: [
    {
      label: 'Session ID',
      key: 'sessionId',
      type: 'string',
      required: false,
      description:
        'ID of the chat session to continue. Leave empty to start a new chat.',
      variables: true,
    },
    {
      label: 'System Prompt',
      key: 'systemPrompt',
      type: 'string',
      required: false,
      description:
        'Optional system prompt to start the chat with. It will be used only for new chat sessions.',
      variables: true,
    },
    {
      label: 'Input',
      key: 'input',
      type: 'string',
      required: true,
      description: 'User input to start the chat with.',
      variables: true,
    },
  ],

  async run($) {
    const response = await $.http.post('/api/v1/sessions/chat', {
      session_id: $.step.parameters.sessionId,
      system: $.step.parameters.systemPrompt,
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
