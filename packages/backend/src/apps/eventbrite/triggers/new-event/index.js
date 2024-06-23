import defineTrigger from '../../../../helpers/define-trigger.js';
import getEvents from './get-events.js';

export default defineTrigger({
  name: 'Get events',
  key: 'getEvents',
  pollInterval: 15,
  description: 'Triggers when new Task(s) are found',
  arguments: [
    {
      label: 'Organization ID',
      key: 'organisationId',
      type: 'dropdown',
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizations',
          },
        ],
      },
    },
    {
      label: 'Collection ID',
      key: 'collectionId',
      type: 'dropdown',
      required: false,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCollections',
          },
          {
            name: 'parameters.organisationId',
            value: '{parameters.organisationId}',
          },
        ],
      },
    },
  ],

  async run($) {
    await getEvents($);
  },
});
