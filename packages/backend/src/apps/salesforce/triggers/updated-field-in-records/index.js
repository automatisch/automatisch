import defineTrigger from '../../../../helpers/define-trigger.js';
import updatedFieldInRecords from './updated-field-in-records.js';

export default defineTrigger({
  name: 'Updated field in records',
  key: 'updatedFieldInRecords',
  pollInterval: 15,
  description: 'Triggers when a field is updated in a record.',
  arguments: [
    {
      label: 'Object',
      key: 'object',
      type: 'dropdown',
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
      type: 'dropdown',
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
