import defineAction from '../../../../helpers/define-action.js';
import paginateAll from '../../common/paginate-all.js';
import { cleanOptionalFields } from '../lib.js';

export default defineAction({
  name: 'Issue: List/find project Issues',
  key: 'issueList',
  description: 'List or find project issues.',
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
      label: 'Search',
      key: 'search',
      type: 'string',
      required: false,
      description: 'Search project issues against their title and description.',
      variables: true,
    },
    {
      label: 'Issue Numbers',
      key: 'iids',
      type: 'string',
      required: false,
      description: 'Comma-separated issue number.',
      variables: true,
    },
    {
      label: 'Assignee ID',
      key: 'assignee_id',
      type: 'string',
      required: false,
      description:
        'Return issues assigned to the given user `id`. Mutually exclusive with `assignee_username`. `None` returns unassigned issues. `Any` returns issues with an assignee.',
      variables: true,
    },
    {
      label: 'Assignee Username',
      key: 'assignee_username',
      type: 'string',
      required: false,
      description:
        'Comma-separated usernames that the issues assigned to. Similar to `assignee_id` and mutually exclusive with `assignee_id`. In GitLab CE, the `assignee_username` array should only contain a single value. Otherwise, an invalid parameter error is returned.',
      variables: true,
    },
    {
      label: 'Author ID',
      key: 'author_id',
      type: 'string',
      required: false,
      description:
        'Return issues created by the given user id. Mutually exclusive with author_username. Combine with scope=all or scope=assigned_to_me.',
      variables: true,
    },
    {
      label: 'Author Username',
      key: 'author_username',
      type: 'string',
      required: false,
      description:
        'Return issues created by the given username. Similar to `author_id` and mutually exclusive with `author_id`.',
      variables: true,
    },
    {
      label: 'Confidential',
      key: 'confidential',
      type: 'dropdown',
      required: false,
      description: `Filter confidential or public issues.`,
      value: '',
      options: [
        { label: 'Any', value: '' },
        { label: 'Not Confidential', value: 'false' },
        { label: 'Confidential', value: 'true' },
      ],
    },
    {
      label: 'State',
      key: 'state',
      type: 'dropdown',
      required: false,
      description: 'Return all issues or just those that are opened or closed.',
      value: '',
      options: [
        { label: 'All', value: '' },
        { label: 'Opened', value: 'opened' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      label: 'Created After',
      key: 'created_after',
      type: 'string',
      required: false,
      description:
        'Return issues created on or after the given time. Expected in ISO 8601 format (`2011-10-03T05:18:00Z`).',
      variables: true,
    },
    {
      label: 'Created After',
      key: 'created_before',
      type: 'string',
      required: false,
      description:
        'Return issues created on or before the given time. Expected in ISO 8601 format (`2011-10-03T05:18:00Z`).',
      variables: true,
    },
    {
      label: 'Due Date',
      key: 'due_date',
      type: 'dropdown',
      required: false,
      description: `Return issues that have no due date, are overdue, or whose due date is this week, this month, or between two weeks ago and next month.`,
      value: '0',
      options: [
        { label: 'No Due Date', value: '0' },
        { label: 'Any', value: 'any' },
        { label: 'Due Today', value: 'today' },
        { label: 'Due Tommorow', value: 'tomorrow' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Due This Week', value: 'week' },
        { label: 'Due This Month', value: 'month' },
        {
          label: 'Due Between Two Weeks Ago And Next Month',
          value: 'next_month_and_previous_two_weeks',
        },
      ],
    },
    {
      label: 'Epic ID',
      key: 'epic_id',
      type: 'string',
      required: false,
      description:
        'Return issues associated with the given epic ID. `None` returns issues that are not associated with an epic. `Any` returns issues that are associated with an epic. Premium and Ultimate only.',
      variables: true,
    },
    {
      label: 'Issue Type',
      key: 'issue_type',
      type: 'dropdown',
      required: false,
      description: 'Filter to a given type of issue.',
      value: '',
      options: [
        { label: 'Any', value: '' },
        { label: 'Issue', value: 'issue' },
        { label: 'Incident', value: 'incident' },
        { label: 'Test Case', value: 'test_case' },
        { label: 'Task', value: 'task' },
      ],
    },
    {
      label: 'Scope',
      key: 'scope',
      type: 'dropdown',
      required: false,
      description:
        'Return issues for the given scope: `created_by_me`, `assigned_to_me` or `all`. Defaults to `all`.',
      value: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Created by Me', value: 'created_by_me' },
        { label: 'Assigned to Me', value: 'assigned_to_me' },
      ],
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'string',
      required: false,
      description:
        'Comma-separated list of label names, issues must have all labels to be returned. `None` lists all issues with no labels. `Any` lists all issues with at least one label. Predefined names are case-insensitive.',
    },
    {
      label: 'Iteration ID',
      key: 'iteration_id',
      type: 'string',
      required: false,
      description:
        'Return issues assigned to the given iteration ID. None returns issues that do not belong to an iteration. Any returns issues that belong to an iteration. Mutually exclusive with iteration_title. Premium and Ultimate only.',
      variables: true,
    },
    {
      label: 'Iteration Title',
      key: 'iteration_title',
      type: 'string',
      required: false,
      description:
        'Return issues assigned to the iteration with the given title. Similar to `iteration_id` and mutually exclusive with `iteration_id`. Premium and Ultimate only.',
      variables: true,
    },

    {
      label: 'Milestone Title',
      key: 'milestone',
      type: 'string',
      required: false,
      description:
        'The milestone title. `None` lists all issues with no milestone. `Any` lists all issues that have an assigned milestone.',
      variables: true,
    },
    {
      label: 'My Reaction',
      key: 'my_reaction_emoji',
      type: 'string',
      required: false,
      description:
        'Return issues reacted by the authenticated user by the given emoji. `None` returns issues not given a reaction. `Any` returns issues given at least one reaction.',
      variables: true,
    },

    {
      label: 'Updated After',
      key: 'updated_after',
      type: 'string',
      required: false,
      description:
        'Return issues updated on or after the given time. Expected in ISO 8601 format (`2011-10-03T05:18:00Z`).',
      variables: true,
    },
    {
      label: 'Updated After',
      key: 'updated_before',
      type: 'string',
      required: false,
      description:
        'Return issues updated on or before the given time. Expected in ISO 8601 format (`2011-10-03T05:18:00Z`).',
      variables: true,
    },
    {
      label: 'Weight',
      key: 'weight',
      type: 'string',
      required: false,
      description:
        'Return issues with the specified weight. `None` returns issues with no weight assigned. `Any` returns issues with a weight assigned. Premium and Ultimate only.',
      variables: true,
    },
    {
      label: 'Order By',
      key: 'order_by',
      type: 'dropdown',
      required: false,
      description:
        'Return issues ordered by `created_at`, `updated_at`, `priority`, `due_date`, `relative_position`, `label_priority`, `milestone_due`, `popularity`, `weight` fields. Default is `created_at`.',
      value: 'created_at',
      options: [
        { label: 'Created Date', value: 'created_at' },
        { label: 'Updated Date', value: 'updated_at' },
        { label: 'Priority', value: 'priority' },
        { label: 'Due Date', value: 'due_date' },
        { label: 'Relative Position', value: 'relative_position' },
        { label: 'Label Priority', value: 'label_priority' },
        { label: 'Milestone Due', value: 'milestone_due' },
        { label: 'Popularity', value: 'popularity' },
        { label: 'Weight', value: 'weight' },
      ],
    },
    {
      label: 'Sort',
      key: 'sort',
      type: 'dropdown',
      required: false,
      description:
        'Return issues sorted in `asc` or `desc` order. Default is `desc`.',
      value: 'desc',
      options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' },
      ],
    },
    {
      label: 'Expand the Label Details',
      key: 'with_labels_details',
      type: 'dropdown',
      required: false,
      description:
        'If `true`, the response returns more details for each label in labels field: `:name`, `:color`, `:description`, `:description_html`, `:text_color`. Default is `false`.',
      value: 'false',
      options: [
        { label: "Don't Expand", value: 'false' },
        { label: 'Expand', value: 'true' },
      ],
    },
  ],

  async run($) {
    let { id, ...params } = $.step.parameters;

    params = cleanOptionalFields(params);

    if (params.iids) {
      params.iids = params.iids.split(',').map((iid) => iid.trim());
    }

    let response = await $.http.get(
      `/api/v4/projects/${encodeURI(id)}/issues`,
      {
        params,
      }
    );
    response = paginateAll($, response);

    $.setActionItem({ raw: response.data });
  },
});
