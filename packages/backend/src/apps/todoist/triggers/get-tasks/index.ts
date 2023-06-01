import defineTrigger from '../../../../helpers/define-trigger';
import getActiveTasks from './get-tasks';

export default defineTrigger({
  name: 'Get active tasks',
  key: 'getActiveTasks',
  pollInterval: 15,
  description: 'Triggers when new Task(s) are found',
  arguments: [
    {
      label: 'Project ID',
      key: 'projectId',
      type: 'dropdown' as const,
      required: false,
      variables: false,
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
      variables: false,
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
      label: 'Label',
      key: 'label',
      type: 'dropdown' as const,
      required: false,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLabels',
          },
        ],
      },
    },
    {
      label: 'Filter',
      key: 'filter',
      type: 'string' as const,
      required: false,
      variables: false,
      description:
        'Limit queried tasks to this filter. Example: "Meeting & today"',
    },
  ],

  async run($) {
    await getActiveTasks($);
  },
});
