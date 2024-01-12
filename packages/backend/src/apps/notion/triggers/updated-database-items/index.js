import defineTrigger from '../../../../helpers/define-trigger.js';
import updatedDatabaseItems from './updated-database-items.js';

export default defineTrigger({
  name: 'Updated database items',
  key: 'updatedDatabaseItems',
  pollInterval: 15,
  description:
    'Triggers when there is an update to an item in a chosen database',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
      type: 'dropdown',
      required: false,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDatabases',
          },
        ],
      },
    },
  ],

  async run($) {
    await updatedDatabaseItems($);
  },
});
