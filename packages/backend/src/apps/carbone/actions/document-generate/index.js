import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Generate a Document',
  key: 'generateDocument',
  description:
    'Generates a document from a template ID and a JSON data-set.',
  arguments: [
    {
        label: 'Template ID',
        key: 'templateId',
        type: 'string',
        required: true,
        variables: true,
        description: 'Unique ID of the template',
    },
    {
        label: 'JSON Data-set',
        key: 'data',
        type: 'string',
        required: true,
        variables: true,
        description: 'JSON data injected into the template',
    },
    {
        label: 'Convert To',
        key: 'convertTo',
        type: 'dropdown',
        required: false,
        variables: true,
        description: 'Convert the document into another format. Accepted values: odp ppt pptx jpg png odt doc docx txt jpg png epub html xml idml. List of supported formats: https://carbone.io/documentation.html#supported-files-and-features-list ',
        options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'TXT', value: 'txt' },
            { label: 'ODS', value: 'ods' },
            { label: 'XLSX', value: 'xlsx' },
            { label: 'XLS', value: 'xls' },
            { label: 'CSV', value: 'csv' },
            { label: 'ODP', value: 'odp' },
            { label: 'PPTX', value: 'pptx' },
            { label: 'PPT', value: 'ppt' },
            { label: 'JPG', value: 'jpg' },
            { label: 'PNG', value: 'png' },
            { label: 'ODT', value: 'odt' },
            { label: 'DOCX', value: 'docx' },
            { label: 'EPUB', value: 'epub' },
            { label: 'HTML', value: 'html' },
            { label: 'XML', value: 'xml' },
            { label: 'IDML', value: 'idml' }
        ],
    },
  ],

  async run($) {
    const body = {}

    body.data = $.step.parameters.data;
    if ($.step.parameters?.convertTo) {
        body.convertTo = $.step.parameters.convertTo
    }

    const response = await $.http.post(`/render/${$.step.parameters.templateId}`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    $.setActionItem({ raw: response.data });
  },
});
