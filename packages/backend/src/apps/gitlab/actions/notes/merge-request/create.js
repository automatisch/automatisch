import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create New Merge Request Note',
  key: 'mergeRequestNoteCreate',
  description:
    'Creates a new note for a single merge request. Notes are not attached to specific lines in a merge request.',
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
      label: 'Merge Request IID',
      key: 'merge_request_iid',
      type: 'integer',
      required: true,
      description: 'The IID of a project merge request.',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'The content of a note. Limited to 1,000,000 characters.',
      variables: true,
    },
    {
      label: 'Created At',
      key: 'created_at',
      type: 'string',
      required: false,
      description:
        'Date time string, ISO 8601 formatted. Example: `2011-11-03T09:00:00Z` (requires administrator or project/group owner rights).',
      variables: true,
    },
    {
      label: 'Merge Request Diff Head SHA',
      key: 'merge_request_diff_head_sha',
      type: 'string',
      required: false,
      description:
        "Required for the `/merge` quick action. The SHA of the head commit, which ensures the merge request wasn't updated after the API request was sent.",
      variables: true,
    },
  ],

  async run($) {
    const { id, merge_request_iid, ...params } = $.step.parameters;

    const response = await $.http.post(
      `/api/v4/projects/${encodeURI(
        id
      )}/merge_requests/${merge_request_iid}/notes`,
      { params }
    );

    $.setActionItem({ raw: response.data });
  },
});
