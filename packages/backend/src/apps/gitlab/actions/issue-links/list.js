import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Issue: List Issue Relations',
  key: 'issueLinksList',
  description:
    "Get a list of a given issue's linked issues, sorted by the relationship creation datetime (ascending). Issues are filtered according to the user authorizations.",
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
      label: 'Issue Internal ID',
      key: 'issue_iid',
      type: 'string',
      required: true,
      description: "The internal ID of a project's issue",
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid } = $.step.parameters;

    const response = await $.http.get(
      `/api/v4/projects/${id}/issues/${issue_iid}/links`
    );

    $.setActionItem({ raw: response.data });
  },
});
