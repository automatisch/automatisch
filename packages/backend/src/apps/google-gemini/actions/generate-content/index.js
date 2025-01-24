import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Generate Content',
  key: 'generateContent',
  description: 'Generate Content using the Google Gemini API.',
  arguments: [
    {
      label: 'Text Input',
      key: 'textInput',
      type: 'string',
      required: true,
      description: 'The text input to generate content from.',
      variables: true,
    },
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown',
      required: true,
      variables: false,
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
  ],

  async run($) {
    const text = $.step.parameters.textInput;
    const response = await $.http.post('/' + $.step.parameters.model + ':generateContent?key=' + $.auth.data.apiKey, {
      contents: [
          {
            parts: [
              {
                text
              },
            ],
          },
        ],
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

     $.setActionItem({ raw: response.data });

  },
});