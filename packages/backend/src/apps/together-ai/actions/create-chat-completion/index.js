import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Create chat completion',
  key: 'createChatCompletion',
  description: 'Queries a chat model.',
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
      description: 'A list of messages comprising the conversation so far.',
      value: [{ role: 'system', body: '' }],
      fields: [
        {
          label: 'Role',
          key: 'role',
          type: 'dropdown',
          required: true,
          description:
            'The role of the messages author. Choice between: system, user, or assistant.',
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
          description:
            'The content of the message, which can either be a simple string or a structured format.',
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
        'A decimal number from 0-1 that determines the degree of randomness in the response. A temperature less than 1 favors more correctness and is appropriate for question answering or summarization. A value closer to 1 introduces more randomness in the output.',
    },
    {
      label: 'Maximum tokens',
      key: 'maxTokens',
      type: 'string',
      required: false,
      variables: true,
      description: 'The maximum number of tokens to generate.',
    },
    {
      label: 'Stop sequences',
      key: 'stopSequences',
      type: 'dynamic',
      required: false,
      variables: true,
      description:
        'A list of string sequences that will truncate (stop) inference text output. For example, "" will stop generation as soon as the model generates the given token.',
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
      description: `A percentage (also called the nucleus parameter) that's used to dynamically adjust the number of choices for each predicted token based on the cumulative probabilities. It specifies a probability threshold below which all less likely tokens are filtered out. This technique helps maintain diversity and generate more fluent and natural-sounding text.`,
    },
    {
      label: 'Top K',
      key: 'topK',
      type: 'string',
      required: false,
      variables: true,
      description: `An integer that's used to limit the number of choices for the next predicted word or token. It specifies the maximum number of tokens to consider at each step, based on their probability of occurrence. This technique helps to speed up the generation process and can improve the quality of the generated text by focusing on the most likely options.`,
    },
    {
      label: 'Frequency Penalty',
      key: 'frequencyPenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `A number between -2.0 and 2.0 where a positive value decreases the likelihood of repeating tokens that have already been mentioned.`,
    },
    {
      label: 'Presence Penalty',
      key: 'presencePenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `A number between -2.0 and 2.0 where a positive value increases the likelihood of a model talking about new topics.`,
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
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      stop: nonEmptyStopSequences,
      top_p: castFloatOrUndefined($.step.parameters.topP),
      top_k: castFloatOrUndefined($.step.parameters.topK),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty),
      frequency_penalty: castFloatOrUndefined(
        $.step.parameters.frequencyPenalty
      ),
    };

    const { data } = await $.http.post('/v1/chat/completions', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
