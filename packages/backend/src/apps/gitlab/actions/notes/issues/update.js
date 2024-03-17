import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Issue: Update an Issue Note',
  key: 'issueNoteUpdate',
  description: 'Modify existing note of an issue.',
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
      description: 'The ID of a note.',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: false,
      description: 'The content of a note. Limited to 1,000,000 characters.',
    },
  ],

  async run($) {
    const { id, issue_iid, note_id, ...params } = $.step.parameters;

    const response = await $.http.put(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}/notes/${note_id}`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
