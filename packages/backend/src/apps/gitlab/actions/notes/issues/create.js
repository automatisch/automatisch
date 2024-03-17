import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Issue: Create a new Issue Note',
  key: 'issueNoteCreate',
  description: 'Creates a new note to a single project issue.',
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
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'The content of a note. Limited to 1,000,000 characters.',
      variables: true,
    },
    {
      label: 'Internal',
      key: 'internal',
      type: 'dropdown',
      required: false,
      description: 'The internal flag of a note. Default is `false`.',
      value: 'false',
      options: [
        { label: 'Not Confidential', value: 'false' },
        { label: 'Confidential', value: 'true' },
      ],
    },
    {
      label: 'Created At',
      key: 'created_at',
      type: 'string',
      required: false,
      description:
        'Date time string, ISO 8601 formatted. It must be after 1970-01-01. Example: `2011-11-03T09:00:00Z` (requires administrator or project/group owner rights)',
      variables: true,
    },
  ],

  async run($) {
    const { id, issue_iid, ...params } = $.step.parameters;

    const response = await $.http.post(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}/notes`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
