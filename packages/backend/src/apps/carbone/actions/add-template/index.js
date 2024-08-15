import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Add Template',
  key: 'addTemplate',
  description:
    'Creates an attachment of a specified object by given parent ID.',
  arguments: [
    {
      label: 'Template Data',
      key: 'templateData',
      type: 'string',
      required: true,
      variables: true,
      description: 'The content of your new Template in XML/HTML format.',
    },
  ],

  async run($) {
    const templateData = $.step.parameters.templateData;

    const base64Data = Buffer.from(templateData).toString('base64');
    const dataURI = `data:application/xml;base64,${base64Data}`;

    const body = JSON.stringify({ template: dataURI });

    const response = await $.http.post('/template', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    $.setActionItem({ raw: response.data });
  },
});
