import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete an Issue',
  key: 'issueDelete',
  description: 'Deletes an issue. Only for administrators and project owners.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description:
        'The global ID or URL-encoded path of the project owned by the authenticated user.',
      variables: true,
    },
    {
      label: 'Issue Internal ID',
      key: 'issue_iid',
      type: 'string',
      required: true,
      description: "The internal ID of a project's issue.",
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid } = $.step.parameters;

    const response = await $.http.delete(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}`
    );

    $.setActionItem({ raw: response.data });
  },
});
