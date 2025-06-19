import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Create chat completion',
  key: 'createChatCompletion',
  description: 'Creates a chat completion.',
  arguments: [
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown',
      required: true,
      variables: true,
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
      description:
        'The prompt(s) to generate completions for, encoded as a list of dict with role and content.',
      value: [{ role: 'system', body: '' }],
      fields: [
        {
          label: 'Role',
          key: 'role',
          type: 'dropdown',
          required: true,
          options: [
            {
              label: 'System',
              value: 'system',
            },
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
      label: 'Temperature',
      key: 'temperature',
      type: 'string',
      required: false,
      variables: true,
      description:
        'What sampling temperature to use. Higher values mean the model will take more risk. Try 0.9 for more creative applications, and 0 for ones with a well-defined answer. We generally recommend altering this or Top P but not both.',
    },
    {
      label: 'Maximum tokens',
      key: 'maxTokens',
      type: 'string',
      required: false,
      variables: true,
      description: `The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.`,
    },
    {
      label: 'Stop sequences',
      key: 'stopSequences',
      type: 'dynamic',
      required: false,
      variables: true,
      description: 'Stop generation if one of these tokens is detected',
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
    {
      label: 'Top P',
      key: 'topP',
      type: 'string',
      required: false,
      variables: true,
      description:
        'Nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.',
    },
    {
      label: 'Frequency Penalty',
      key: 'frequencyPenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `Frequency_penalty penalizes the repetition of words based on their frequency in the generated text. A higher frequency penalty discourages the model from repeating words that have already appeared frequently in the output, promoting diversity and reducing repetition.`,
    },
    {
      label: 'Presence Penalty',
      key: 'presencePenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `Presence penalty determines how much the model penalizes the repetition of words or phrases. A higher presence penalty encourages the model to use a wider variety of words and phrases, making the output more diverse and creative.`,
    },
  ],

  async run($) {
    const nonEmptyStopSequences = $.step.parameters.stopSequences
      .filter(({ stopSequence }) => stopSequence)
      .map(({ stopSequence }) => stopSequence);

    const messages = $.step.parameters.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const payload = {
      model: $.step.parameters.model,
      messages,
      stop: nonEmptyStopSequences,
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      top_p: castFloatOrUndefined($.step.parameters.topP),
      frequency_penalty: castFloatOrUndefined(
        $.step.parameters.frequencyPenalty
      ),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty),
    };

    const { data } = await $.http.post('/v1/chat/completions', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
