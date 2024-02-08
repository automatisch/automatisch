import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Get Single Project Issue',
  key: 'singleProjectIssueGet',
  description: 'Get a single project issue.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description: 'The global ID or path of the project.',
      variables: true,
    },
    {
      label: 'Issue IID',
      key: 'issue_iid',
      type: 'integer',
      required: true,
      description: "The internal ID of a project's issue.",
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid } = $.step.parameters;

    const response = await $.http.get(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}`
    );

    $.setActionItem({ raw: response.data });
  },
});
