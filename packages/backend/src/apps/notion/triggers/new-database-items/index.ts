import defineTrigger from '../../../../helpers/define-trigger';
import newDatabaseItems from './new-database-items';

export default defineTrigger({
  name: 'New database items',
  key: 'newDatabaseItems',
  pollInterval: 15,
  description: 'Triggers when a new database item is created',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
      type: 'dropdown' as const,
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
    await newDatabaseItems($);
  },
});
