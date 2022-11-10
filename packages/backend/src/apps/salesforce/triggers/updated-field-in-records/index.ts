import defineTrigger from '../../../../helpers/define-trigger';
import updatedFieldInRecords from './updated-field-in-records';

export default defineTrigger({
  name: 'Updated field in records',
  key: 'updatedFieldInRecords',
  pollInterval: 15,
  description: 'Triggers when a field is updated in a record.',
  arguments: [
    {
      label: 'Object',
      key: 'object',
      type: 'dropdown' as const,
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listObjects',
          },
        ],
      },
    },
    {
      label: 'Field',
      key: 'field',
      type: 'dropdown' as const,
      description: 'Track updates by this field',
      required: true,
      variables: false,
      dependsOn: ['parameters.object'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFields',
          },
          {
            name: 'parameters.object',
            value: '{parameters.object}',
          },
        ],
      },
    },
  ],

  async run($) {
    await updatedFieldInRecords($);
  },
});
