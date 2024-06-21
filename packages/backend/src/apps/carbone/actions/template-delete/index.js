import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete a Template',
  key: 'deleteTemplate',
  description:
    'Deletes a template from your Carbone storage according to a "Template ID".',
  arguments: [
    {
        label: 'Template ID',
        key: 'templateID',
        type: 'string',
        required: true,
        variables: true,
        description: 'Unique ID of the template',
    }
  ],

  async run($) {
    const response = await $.http.delete(`/template/${$.step.parameters.templateID}`);
    
    $.setActionItem({ raw: response.data });
  },
});
