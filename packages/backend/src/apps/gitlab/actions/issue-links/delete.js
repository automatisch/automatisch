import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete an Issue Relation',
  key: 'issueLinksDelete',
  description: 'Deletes an issue link, thus removes the two-way relationship.',
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
      label: 'Issue Link ID',
      key: 'issue_link_id',
      type: 'string',
      required: true,
      description: 'The ID of an issue relationship',
      variables: true,
    },
    {
      label: 'Link Type',
      key: 'link_type',
      type: 'dropdown',
      required: false,
      description:
        'The type of the relation (relates_to, blocks, is_blocked_by), defaults to relates_to',
      value: 'relates_to',
      options: [
        { label: 'Relates to', value: 'relates_to' },
        { label: 'Blocks', value: 'blocks' },
        { label: 'Is Blocked By', value: 'is_blocked_by' },
      ],
    },
  ],

  async run($) {
    const { id, issue_iid, issue_link_id, ...params } = $.step.parameters;

    const response = await $.http.delete(
      `/api/v4/projects/${id}/issues/${issue_iid}/links/${issue_link_id}`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
