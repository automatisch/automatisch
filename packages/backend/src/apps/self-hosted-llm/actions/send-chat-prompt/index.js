import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Send chat prompt',
  key: 'sendChatPrompt',
  description: 'Creates a completion for the provided prompt and parameters.',
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
      description: 'Add or remove messages as needed',
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
      description:
        'The maximum number of tokens to generate in the completion.',
    },
    {
      label: 'Stop Sequence',
      key: 'stopSequence',
      type: 'string',
      required: false,
      variables: true,
      description:
        'Single stop sequence where the API will stop generating further tokens. The returned text will not contain the stop sequence.',
    },
    {
      label: 'Top P',
      key: 'topP',
      type: 'string',
      required: false,
      variables: true,
      description:
        'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with Top P probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.',
    },
    {
      label: 'Frequency Penalty',
      key: 'frequencyPenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.`,
    },
    {
      label: 'Presence Penalty',
      key: 'presencePenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.`,
    },
  ],

  async run($) {
    const payload = {
      model: $.step.parameters.model,
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      stop: $.step.parameters.stopSequence || null,
      top_p: castFloatOrUndefined($.step.parameters.topP),
      frequency_penalty: castFloatOrUndefined(
        $.step.parameters.frequencyPenalty
      ),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty),
      messages: $.step.parameters.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };
    const { data } = await $.http.post('/v1/chat/completions', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
