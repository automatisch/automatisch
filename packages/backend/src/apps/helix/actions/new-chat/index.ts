import FormData from 'form-data';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'New chat',
  key: 'newChat',
  description: 'Create a new chat session for Helix AI.',
  arguments: [
    {
      label: 'Input',
      key: 'input',
      type: 'string' as const,
      required: true,
      description: 'Prompt to start the chat with.',
      variables: true,
    },
  ],

  async run($) {
    const formData = new FormData();
    formData.append('input', $.step.parameters.input as string);
    formData.append('mode', 'inference');
    formData.append('type', 'text');

    const sessionResponse = await $.http.post('/api/v1/sessions', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const sessionId = sessionResponse.data.id;

    let chatGenerated = false;

    while (!chatGenerated) {
      const response = await $.http.get(`/api/v1/sessions/${sessionId}`);

      const message =
        response.data.interactions[response.data.interactions.length - 1];

      if (message.creator === 'system' && message.state === 'complete') {
        $.setActionItem({
          raw: message,
        });

        chatGenerated = true;
      }
    }
  },
});
