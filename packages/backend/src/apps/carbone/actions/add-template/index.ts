import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Add Template',
  key: 'addTemplate',
  description:
    'Creates an attachment of a specified object by given parent ID.',
  arguments: [
    {
      label: 'Templete Data',
      key: 'templateData',
      type: 'string' as const,
      required: true,
      variables: true,
      description: 'The content of your new Template in XML/HTML format.',
    },
  ],

  async run($) {
    const templateData = $.step.parameters.templateData as string;

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
