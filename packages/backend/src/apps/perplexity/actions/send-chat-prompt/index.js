import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Send chat prompt',
  key: 'sendChatPrompt',
  description: `Generates a model's response for the given chat conversation.`,
  arguments: [
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown',
      required: true,
      variables: true,
      options: [
        {
          label: 'Sonar Pro',
          value: 'sonar-pro',
        },
        {
          label: 'Sonar',
          value: 'sonar',
        },
      ],
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
          description:
            'The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with user then assistant, ending in user.',
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
            'The contents of the message in this turn of conversation.',
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
        'The amount of randomness in the response, valued between 0 inclusive and 2 exclusive. Higher values are more random, and lower values are more deterministic.',
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
      label: 'Top P',
      key: 'topP',
      type: 'string',
      required: false,
      variables: true,
      description:
        'The nucleus sampling threshold, valued between 0 and 1 inclusive. For each subsequent token, the model considers the results of the tokens with top_p probability mass. We recommend either altering top_k or top_p, but not both.',
    },
    {
      label: 'Top K',
      key: 'topK',
      type: 'string',
      required: false,
      variables: true,
      description:
        'The number of tokens to keep for highest top-k filtering, specified as an integer between 0 and 2048 inclusive. If set to 0, top-k filtering is disabled. We recommend either altering top_k or top_p, but not both.',
    },
    {
      label: 'Frequency Penalty',
      key: 'frequencyPenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `A multiplicative penalty greater than 0. Values greater than 1.0 penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. A value of 1.0 means no penalty. Incompatible with presence_penalty.`,
    },
    {
      label: 'Presence Penalty',
      key: 'presencePenalty',
      type: 'string',
      required: false,
      variables: true,
      description: `A value between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. Incompatible with frequency_penalty.`,
    },
    {
      label: 'Return images',
      key: 'returnImages',
      type: 'dropdown',
      required: false,
      variables: true,
      value: false,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    {
      label: 'Return related questions',
      key: 'returnRelatedQuestions',
      type: 'dropdown',
      required: false,
      variables: true,
      value: false,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
  ],

  async run($) {
    const payload = {
      model: $.step.parameters.model,
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      top_p: castFloatOrUndefined($.step.parameters.topP),
      top_k: castFloatOrUndefined($.step.parameters.topK),
      frequency_penalty: castFloatOrUndefined(
        $.step.parameters.frequencyPenalty
      ),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty),
      messages: $.step.parameters.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      return_images: $.step.parameters.returnImages,
      return_related_questions: $.step.parameters.returnRelatedQuestons,
    };

    const { data } = await $.http.post('/chat/completions', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
