import defineAction from '../../../../helpers/define-action.js';
import { URLSearchParams } from 'url';

export default defineAction({
  name: 'Find record',
  key: 'findRecord',
  description:
    "Finds a record using simple field search or use Airtable's formula syntax to find a matching record.",
  arguments: [
    {
      label: 'Base',
      key: 'baseId',
      type: 'dropdown',
      required: true,
      description: 'Base in which to create the record.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBases',
          },
        ],
      },
    },
    {
      label: 'Table',
      key: 'tableId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.baseId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTables',
          },
          {
            name: 'parameters.baseId',
            value: '{parameters.baseId}',
          },
        ],
      },
    },
    {
      label: 'Search by field',
      key: 'tableField',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.baseId', 'parameters.tableId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTableFields',
          },
          {
            name: 'parameters.baseId',
            value: '{parameters.baseId}',
          },
          {
            name: 'parameters.tableId',
            value: '{parameters.tableId}',
          },
        ],
      },
    },
    {
      label: 'Search Value',
      key: 'searchValue',
      type: 'string',
      required: false,
      variables: true,
      description:
        'The value of unique identifier for the record. For date values, please use the ISO format (e.g., "YYYY-MM-DD").',
    },
    {
      label: 'Search for exact match?',
      key: 'exactMatch',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      label: 'Search Formula',
      key: 'searchFormula',
      type: 'string',
      required: false,
      variables: true,
      description:
        'Instead, you have the option to use an Airtable search formula for locating records according to sophisticated criteria and across various fields.',
    },
    {
      label: 'Limit to View',
      key: 'limitToView',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.baseId', 'parameters.tableId'],
      description:
        'You have the choice to restrict the search to a particular view ID if desired.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTableViews',
          },
          {
            name: 'parameters.baseId',
            value: '{parameters.baseId}',
          },
          {
            name: 'parameters.tableId',
            value: '{parameters.tableId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const {
      baseId,
      tableId,
      tableField,
      searchValue,
      exactMatch,
      searchFormula,
      limitToView,
    } = $.step.parameters;

    let filterByFormula;

    if (tableField && searchValue) {
      filterByFormula =
        exactMatch === 'true'
          ? `{${tableField}} = '${searchValue}'`
          : `LOWER({${tableField}}) = LOWER('${searchValue}')`;
    } else {
      filterByFormula = searchFormula;
    }

    const body = new URLSearchParams({
      filterByFormula,
      view: limitToView,
    });

    const { data } = await $.http.post(
      `/v0/${baseId}/${tableId}/listRecords`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
