import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Send message',
  key: 'sendMessage',
  description:
    'Sends a structured list of input messages with text content, and the model will generate the next message in the conversation.',
  arguments: [
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'The model that will complete your prompt.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listModels',
          },
        ],
      },
    },
    {
      label: 'Messages',
      key: 'messages',
      type: 'dynamic',
      required: true,
      description: 'Add or remove messages as needed',
      value: [{ role: 'assistant', body: '' }],
      fields: [
        {
          label: 'Role',
          key: 'role',
          type: 'dropdown',
          required: true,
          options: [
            {
              label: 'Assistant',
              value: 'assistant',
            },
            {
              label: 'User',
              value: 'user',
            },
          ],
        },
        {
          label: 'Content',
          key: 'content',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
    {
      label: 'Maximum tokens',
      key: 'maxTokens',
      type: 'string',
      required: true,
      variables: true,
      description: 'The maximum number of tokens to generate before stopping.',
    },
    {
      label: 'Temperature',
      key: 'temperature',
      type: 'string',
      required: false,
      variables: true,
      value: '1.0',
      description:
        'Amount of randomness injected into the response. Defaults to 1.0. Ranges from 0.0 to 1.0. Use temperature closer to 0.0 for analytical / multiple choice, and closer to 1.0 for creative and generative tasks.',
    },
    {
      label: 'Stop sequences',
      key: 'stopSequences',
      type: 'dynamic',
      required: false,
      variables: true,
      description:
        'Custom text sequences that will cause the model to stop generating.',
      fields: [
        {
          label: 'Stop sequence',
          key: 'stopSequence',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const nonEmptyStopSequences = $.step.parameters.stopSequences
      .filter(({ stopSequence }) => stopSequence)
      .map(({ stopSequence }) => stopSequence);

    const payload = {
      model: $.step.parameters.model,
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      stop_sequences: nonEmptyStopSequences,
      messages: $.step.parameters.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };

    const { data } = await $.http.post('/v1/messages', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
