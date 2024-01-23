import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create record',
  key: 'createRecord',
  description: 'Creates a new record with fields that automatically populate.',
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
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listFields',
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
    const { baseId, tableId, ...rest } = $.step.parameters;

    const { Tags, ...fields } = rest;

    const body = {
      typecast: true,
      fields: {
        Tags: [Tags],
        ...fields,
      },
    };

    const { data } = await $.http.post(`/v0/${baseId}/${tableId}`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
