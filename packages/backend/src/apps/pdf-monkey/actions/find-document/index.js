import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find document',
  key: 'findDocument',
  description: 'Finds a document.',
  arguments: [
    {
      label: 'Document ID',
      key: 'documentId',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const { documentId } = $.step.parameters;

    const { data } = await $.http.get(`/v1/documents/${documentId}`);

    $.setActionItem({
      raw: data.document,
    });
  },
});
