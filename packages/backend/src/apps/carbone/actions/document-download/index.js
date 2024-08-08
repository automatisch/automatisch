import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Download a Document',
  key: 'downloadDocument',
  description:
    'Downloads a generated document from a Render Id.',
  arguments: [
    {
        label: 'Render ID',
        key: 'renderId',
        type: 'string',
        required: true,
        variables: true,
        description: 'Unique ID of the generated document',
    }
  ],

  async run($) {
    const response = await $.http.get(`/render/${$.step.parameters.renderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    $.setActionItem({ raw: response.data });
  },
});
