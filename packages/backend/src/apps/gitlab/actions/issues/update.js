import defineAction from '../../../../helpers/define-action.js';
import { cleanOptionalFields } from '../lib.js';

export default defineAction({
  name: 'Issue: Update an Issue',
  key: 'issueUpdate',
  description:
    'Updates an existing project issue. This request is also used to close or reopen an issue (with state_event).',
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
      description: "The internal ID of a project's issue.",
      variables: true,
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: false,
      placeholder: '(Unchanged)',
      description: 'The title of an issue.',
      variables: true,
    },
    {
      label: 'Add Labels',
      key: 'add_labels',
      type: 'string',
      required: false,
      description: 'Comma-separated label names to add to an issue.',
      variables: true,
    },
    {
      label: 'Remove Labels',
      key: 'remove_labels',
      type: 'string',
      required: false,
      description: 'Comma-separated label names to remove from an issue.',
      variables: true,
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'string',
      required: false,
      description:
        'Comma-separated label names for an issue. Leave it empty to not set the label, set to `0` to remove all labels.',
      variables: true,
    },
    {
      label: 'Assignee IDs',
      key: 'assignee_ids',
      type: 'string',
      required: false,
      description:
        'Comma-separated IDs of the users to assign the issue to. Set to `0` or provide an empty value to unassign all assignees.',
      variables: true,
    },
    {
      label: 'Confidential',
      key: 'confidential',
      type: 'dropdown',
      required: false,
      description: `Set an issue to be confidential. Default is not confidential.`,
      value: '',
      options: [
        { label: "Don't Change", value: '' },
        { label: 'Not Confidential', value: 'false' },
        { label: 'Confidential', value: 'true' },
      ],
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      description:
        'The description of an issue. Limited to 1,048,576 characters.',
      variables: true,
    },
    {
      label: 'Lock Discussion',
      key: 'discussion_locked',
      type: 'dropdown',
      required: false,
      description: `Flag indicating if the issue's discussion is locked. If the discussion is locked only project members can add or edit comments.`,
      value: '',
      options: [
        { label: "Don't Change", value: '' },
        { label: 'Unlocked', value: 'false' },
        { label: 'Locked', value: 'true' },
      ],
    },
    {
      label: 'Due Date',
      key: 'due_date',
      type: 'string',
      required: false,
      description:
        'The due date. Date time string in the format `YYYY-MM-DD`, for example `2016-03-11`.',
      variables: true,
    },
    {
      label: 'Epic ID',
      key: 'epic_id',
      type: 'string',
      required: false,
      description:
        'ID of the epic to add the issue to. Valid values are greater than or equal to 0. Premium and Ultimate only.',
      variables: true,
    },
    {
      label: 'Issue Type',
      key: 'type',
      type: 'dropdown',
      required: false,
      description: 'The type of issue.',
      value: '',
      options: [
        { label: "Don't Change", value: '' },
        { label: 'Issue', value: 'issue' },
        { label: 'Incident', value: 'incident' },
        { label: 'Test Case', value: 'test_case' },
        { label: 'Task', value: 'task' },
      ],
    },
    {
      label: 'Milestone ID',
      key: 'milestone_id',
      type: 'string',
      required: false,
      description:
        'The global ID of a milestone to assign the issue to. Set to `0` or provide an empty value to unassign a milestone.',
      variables: true,
    },
    {
      label: 'Issue State',
      key: 'type',
      type: 'dropdown',
      required: false,
      description:
        'The state event of an issue. To close the issue, use `close`, and to reopen it, use `reopen`.',
      value: '',
      options: [
        { label: "Don't Change", value: '' },
        { label: 'Close', value: 'close' },
        { label: 'Reopen', value: 'reopen' },
      ],
    },
    {
      label: 'Weight',
      key: 'weight',
      type: 'string',
      required: false,
      description:
        'The weight of the issue. Valid values are greater than or equal to 0. Premium and Ultimate only.',
      variables: true,
    },
  ],

  async run($) {
    let { id, issue_iid, ...params } = $.step.parameters;

    params = cleanOptionalFields(params);

    // Since the `0` part of the label parameter is our convention, not GitLab,
    // we convert those on the fly.
    if (params.label === '0') {
      params.label = [];
    }

    if (params.assignee_ids) {
      params.assignee_ids = params.assignee_ids
        .split(',')
        .map((id) => id.trim());
    }

    const response = await $.http.put(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
