import defineAction from '../../../../helpers/define-action.js';
import listObjects from '../../dynamic-data/list-objects/index.js';
import listFields from '../../dynamic-data/list-fields/index.js';

export default defineAction({
  name: 'Find partially matching record',
  key: 'findPartiallyMatchingRecord',
  description: 'Finds a record of a specified object by a field containing a value.',
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
      label: 'Search value to contain',
      key: 'searchValue',
      type: 'string',
      required: true,
      variables: true,
      description: 'The value to search for in the field.',
    },
  ],

  async run($) {
    const sanitizedSearchValue = $.step.parameters.searchValue.replaceAll(`'`, `\\'`);

    // validate given object
    const objects = await listObjects.run($);
    const validObject = objects.data.find((object) => object.value === $.step.parameters.object);

    if (!validObject) {
      throw new Error(`The "${$.step.parameters.object}" object does not exist.`);
    }

    // validate given object field
    const fields = await listFields.run($);
    const validField = fields.data.find((field) => field.value === $.step.parameters.field);

    if (!validField) {
      throw new Error(`The "${$.step.parameters.field}" field does not exist on the "${$.step.parameters.object}" object.`);
    }

    const query = `
      SELECT
        FIELDS(ALL)
      FROM
        ${$.step.parameters.object}
      WHERE
        ${$.step.parameters.field} LIKE '%${sanitizedSearchValue}%'
      LIMIT 1
    `;

    const options = {
      params: {
        q: query,
      },
    };

    const { data } = await $.http.get('/services/data/v61.0/query', options);
    const record = data.records[0];

    $.setActionItem({ raw: record });
  },
});
