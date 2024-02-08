import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Get Single Issue Note',
  key: 'issueNoteGet',
  description: 'Returns a single note for a specific project issue.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description: 'The global ID or URL-encoded path of the project.',
      variables: true,
    },
    {
      label: 'Issue Internal ID',
      key: 'issue_iid',
      type: 'integer',
      required: true,
      description: "The internal ID of a project's issue.",
      variables: true,
    },
    {
      label: 'Note ID',
      key: 'note_id',
      type: 'integer',
      required: true,
      description: 'The ID of an issue note.',
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid, note_id } = $.step.parameters;

    const response = await $.http.get(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
