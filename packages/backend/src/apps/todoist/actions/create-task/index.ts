import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create task',
  key: 'createTask',
  description: 'Creates a Task in Todoist',
  arguments: [
    {
      label: 'Project ID',
      key: 'projectId',
      type: 'dropdown' as const,
      required: false,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listProjects',
          },
        ],
      },
    },
    {
      label: 'Section ID',
      key: 'sectionId',
      type: 'dropdown' as const,
      required: false,
      variables: true,
      dependsOn: ['parameters.projectId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSections',
          },
          {
            name: 'parameters.projectId',
            value: '{parameters.projectId}',
          },
        ],
      },
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'string' as const,
      required: false,
      variables: true,
      description:
        'Labels to add to task (comma separated). Examples: "work" "work,imported"',
    },
    {
      label: 'Content',
      key: 'content',
      type: 'string' as const,
      required: true,
      variables: true,
      description: 'Task content, may be markdown. Example: "Foo"',
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'Task description, may be markdown. Example: "Foo"',
    },
  ],

  async run($) {
    const requestPath = `/tasks`;
    const { projectId, sectionId, labels, content, description } =
      $.step.parameters;

    const labelsArray = (labels as string).split(',');

    const payload = {
      content,
      description: description || null,
      project_id: projectId || null,
      labels: labelsArray || null,
      section_id: sectionId || null,
    };

    const response = await $.http.post(requestPath, payload);

    $.setActionItem({ raw: response.data });
  },
});
