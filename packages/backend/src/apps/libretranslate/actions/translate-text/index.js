import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Translate text',
  key: 'translateText',
  description: 'Translate a text.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      description: 'The text to translate.',
      variables: true,
    },
    {
      label: 'Source Language',
      key: 'sourceLanguage',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLanguages',
          },
        ],
      },
    },
    {
      label: 'Target Language',
      key: 'targetLanguage',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLanguages',
          },
        ],
      },
    },
    {
      label: 'Format',
      key: 'format',
      type: 'dropdown',
      description: '',
      required: false,
      variables: true,
      options: [
        {
          label: 'Text',
          value: 'text',
        },
        {
          label: 'HTML',
          value: 'html',
        },
      ],
    },
  ],

  async run($) {
    const { text, sourceLanguage, targetLanguage, format } = $.step.parameters;

    const body = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format,
    };

    const response = await $.http.post('/translate', body);

    $.setActionItem({ raw: response.data });
  },
});
