import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create an new Issue Relation',
  key: 'issueLinkCreate',
  description:
    'Creates a two-way relation between two issues. The user must be allowed to update both issues to succeed.',
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
      description: "The internal ID of a project's issue",
      variables: true,
    },
    {
      label: 'Link Type',
      key: 'link_type',
      type: 'dropdown',
      required: true,
      description:
        'The type of the relation (`relates_to`, `blocks`, `is_blocked_by`), defaults to `relates_to`',
      value: 'relates_to',
      options: [
        { label: 'Relates to', value: 'relates_to' },
        { label: 'Blocks', value: 'blocks' },
        { label: 'Is Blocked By', value: 'is_blocked_by' },
      ],
    },
    {
      label: 'Target Project ID',
      key: 'target_project_id',
      type: 'string',
      required: true,
      description:
        'The ID or URL-encoded path of the project of a target project',
      variables: true,
    },
    {
      label: 'Target Issue Internal ID',
      key: 'target_issue_iid',
      type: 'string',
      required: true,
      description: "The internal ID of a target project's issue",
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid, ...params } = $.step.parameters;

    const response = await $.http.post(
      `/api/v4/projects/${id}/issues/${issue_iid}/links`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
