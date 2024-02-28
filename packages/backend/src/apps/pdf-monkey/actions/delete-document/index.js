import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete document',
  key: 'deleteDocument',
  description: 'Deletes a document.',
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

    await $.http.delete(`/v1/documents/${documentId}`);

    $.setActionItem({
      raw: {
        result: 'successful',
      },
    });
  },
});
