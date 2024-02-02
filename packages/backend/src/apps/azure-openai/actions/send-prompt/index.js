import defineAction from '../../../../helpers/define-action.js';

const castFloatOrUndefined = (value) => {
  return value === '' ? undefined : parseFloat(value);
};

export default defineAction({
  name: 'Send prompt',
  key: 'sendPrompt',
  description: 'Creates a completion for the provided prompt and parameters.',
  arguments: [
    {
      label: 'Prompt',
      key: 'prompt',
      type: 'string',
      required: true,
      variables: true,
      description: 'The text to analyze.',
    },
    {
      label: 'Temperature',
      key: 'temperature',
      type: 'string',
      required: false,
      variables: true,
      description:
        'What sampling temperature to use, between 0 and 2. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend altering this or Top P but not both.',
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
        'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.',
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
      prompt: $.step.parameters.prompt,
      temperature: castFloatOrUndefined($.step.parameters.temperature),
      max_tokens: castFloatOrUndefined($.step.parameters.maxTokens),
      stop: $.step.parameters.stopSequence || null,
      top_p: castFloatOrUndefined($.step.parameters.topP),
      frequency_penalty: castFloatOrUndefined(
        $.step.parameters.frequencyPenalty
      ),
      presence_penalty: castFloatOrUndefined($.step.parameters.presencePenalty),
    };

    const { data } = await $.http.post(
      `/deployments/${$.auth.data.deploymentId}/completions`,
      payload
    );

    $.setActionItem({
      raw: data,
    });
  },
});
