import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Issue: Create a new project Issue',
  key: 'issueCreate',
  description: 'Creates a new project issue.',
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
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: 'The title of an issue.',
      variables: true,
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
      label: 'Assignee ID',
      key: 'assignee_id',
      type: 'string',
      required: false,
      description:
        'The ID of the user to assign the issue to. Only appears on GitLab Free.',
      variables: true,
    },
    {
      label: 'Confidential',
      key: 'confidential',
      type: 'dropdown',
      required: false,
      description: `Set an issue to be confidential. Default is not confidential.`,
      value: 'false',
      options: [
        { label: 'Not Confidential', value: 'false' },
        { label: 'Confidential', value: 'true' },
      ],
    },
    {
      label: 'ID of a discussion to resolve',
      key: 'discussion_to_resolve',
      type: 'string',
      required: false,
      description:
        'The ID of a discussion to resolve. This fills out the issue with a default description and mark the discussion as resolved. Use in combination with `merge_request_to_resolve_discussions_of`.',
      variables: true,
    },
    {
      label: 'Due Date',
      key: 'due_date',
      type: 'string',
      required: false,
      description:
        'The due date. Date time string in the format `YYYY-MM-DD`, for example `2011-10-03`.',
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
      value: 'issue',
      options: [
        { label: 'Issue', value: 'issue' },
        { label: 'Incident', value: 'incident' },
        { label: 'Test Case', value: 'test_case' },
        { label: 'Task', value: 'task' },
      ],
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'string',
      required: false,
      description: 'Comma-separated label names for an issue.',
      variables: true,
    },
    {
      label: 'MR to Resolve Discussions Of',
      key: 'merge_request_to_resolve_discussions_of',
      type: 'string',
      required: false,
      description:
        'The IID of a merge request in which to resolve all issues. This fills out the issue with a default description and mark all discussions as resolved. When passing a description or title, these values take precedence over the default values.',
      variables: true,
    },
    {
      label: 'Milestone ID',
      key: 'milestone_id',
      type: 'string',
      required: false,
      description:
        "The global ID of a milestone to assign issue. To find the milestone_id associated with a milestone, view an issue with the milestone assigned and use the API to retrieve the issue's details.",
      variables: true,
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
    const { id, ...params } = $.step.parameters;

    const response = await $.http.post(
      `/api/v4/projects/${encodeURI(id)}/issues`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
