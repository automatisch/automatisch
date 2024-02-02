import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find record',
  key: 'findRecord',
  description: 'Finds a record of a specified object by a field and value.',
  arguments: [
    {
      label: 'Object',
      key: 'object',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Pick which type of object you want to search for.',
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
      description: 'Pick which field to search by',
      required: true,
      variables: true,
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
    {
      label: 'Search value',
      key: 'searchValue',
      type: 'string',
      required: true,
      variables: true,
    },
  ],

  async run($) {
    const query = `
      SELECT
        FIELDS(ALL)
      FROM
        ${$.step.parameters.object}
      WHERE
        ${$.step.parameters.field} = '${$.step.parameters.searchValue}'
      LIMIT 1
    `;

    const options = {
      params: {
        q: query,
      },
    };

    const { data } = await $.http.get('/services/data/v56.0/query', options);
    const record = data.records[0];

    $.setActionItem({ raw: record });
  },
});
