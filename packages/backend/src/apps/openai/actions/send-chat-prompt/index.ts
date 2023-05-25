import defineAction from '../../../../helpers/define-action';

type TMessage = {
  role: string;
  content: string;
}

const castFloatOrUndefined = (value: string | null) => {
  return value === '' ? undefined : parseFloat(value);
}

export default defineAction({
  name: 'Send chat prompt',
  key: 'sendChatPrompt',
  description: 'Creates a completion for the provided prompt and parameters.',
  arguments: [
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown' as const,
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
      type: 'dynamic' as const,
      required: true,
      description: 'Add or remove messages as needed',
      value: [{ role: 'system', body: '' }],
      fields: [
        {
          label: 'Role',
          key: 'role',
          type: 'dropdown' as const,
          required: true,
          options: [
            {
              label: 'System',
              value: 'system',
            },
            {
              label: 'User',
              value: 'user',
            }
          ],
        },
        {
          label: 'Content',
          key: 'content',
          type: 'string' as const,
          required: true,
          variables: true,
        }
      ],
    },
    {
      label: 'Temperature',
      key: 'temperature',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'What sampling temperature to use. Higher values mean the model will take more risk. Try 0.9 for more creative applications, and 0 for ones with a well-defined answer. We generally recommend altering this or Top P but not both.'
    },
    {
      label: 'Maximum tokens',
      key: 'maxTokens',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'The maximum number of tokens to generate in the completion.'
    },
    {
      label: 'Stop Sequence',
      key: 'stopSequence',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'Single stop sequence where the API will stop generating further tokens. The returned text will not contain the stop sequence.'
    },
    {
      label: 'Top P',
      key: 'topP',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with Top P probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.'
    },
    {
      label: 'Frequency Penalty',
      key: 'frequencyPenalty',
      type: 'string' as const,
      required: false,
      variables: true,
      description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.`
    },
    {
      label: 'presencePenalty',
      key: 'presencePenalty',
      type: 'string' as const,
      required: false,
      variables: true,
      description: `Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.`
    },
  ],

  async run($) {
    const payload = {
      model: $.step.parameters.model as string,
      temperature: castFloatOrUndefined($.step.parameters.temperature as string),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens as string),
      stop: ($.step.parameters.stopSequence as string || null),
      top_p: castFloatOrUndefined($.step.parameters.topP as string),
      frequency_penalty: castFloatOrUndefined($.step.parameters.frequencyPenalty as string),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty as string),
      messages: ($.step.parameters.messages as TMessage[]).map(message => ({
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
