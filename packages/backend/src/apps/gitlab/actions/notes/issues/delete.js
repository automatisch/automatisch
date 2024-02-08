import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete an Issue Note',
  key: 'issueNoteDelete',
  description: 'Deletes an existing note of an issue.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description: 'The ID or path of the project.',
      variables: true,
    },
    {
      label: 'Issue Internal ID',
      key: 'issue_iid',
      type: 'integer',
      required: true,
      description: 'The IID of an issue.',
      variables: true,
    },
    {
      label: 'Note ID',
      key: 'note_id',
      type: 'integer',
      required: true,
      description: 'The ID of a note.',
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid, note_id } = $.step.parameters;

    const response = await $.http.delete(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
