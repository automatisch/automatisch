import defineTrigger from '../../../../helpers/define-trigger';
import updatedFieldInObjects from './updated-field-in-objects';

export default defineTrigger({
  name: 'Updated field in objects',
  key: 'updatedFieldInObjects',
  pollInterval: 15,
  description: 'Triggers when a field is updated in an object.',
  arguments: [
    {
      label: 'Object',
      key: 'object',
      type: 'dropdown' as const,
      required: false,
      variables: false,
      source: {
        type: 'query',
        name: 'getData',
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
        name: 'getData',
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
    await updatedFieldInObjects($);
  },
});
