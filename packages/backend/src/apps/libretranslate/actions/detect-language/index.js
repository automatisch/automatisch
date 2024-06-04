import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Detect language',
  key: 'detectLanguage',
  description: 'Detects language of a text.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      description: 'The text to detect.',
      variables: true,
    },
  ],

  async run($) {
    const { text } = $.step.parameters;

    const body = {
      q: text,
    };

    const response = await $.http.post('/detect', body);

    $.setActionItem({ raw: response.data[0] });
  },
});
