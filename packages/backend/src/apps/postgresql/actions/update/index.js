import defineAction from '../../../../helpers/define-action.js';
import getClient from '../../common/postgres-client.js';
import setParams from '../../common/set-run-time-parameters.js';
import whereClauseOperators from '../../common/where-clause-operators.js';

export default defineAction({
  name: 'Update',
  key: 'update',
  description: 'Update rows found based on the given where clause entries.',
  arguments: [
    {
      label: 'Schema name',
      key: 'schema',
      type: 'string',
      value: 'public',
      required: true,
      variables: true,
    },
    {
      label: 'Table name',
      key: 'table',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Where clause entries',
      key: 'whereClauseEntries',
      type: 'dynamic',
      required: true,
      fields: [
        {
          label: 'Column name',
          key: 'columnName',
          type: 'string',
          required: true,
          variables: true,
        },
        {
          label: 'Operator',
          key: 'operator',
          type: 'dropdown',
          required: true,
          variables: true,
          options: whereClauseOperators,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
    {
      label: 'Column - value entries',
      key: 'columnValueEntries',
      type: 'dynamic',
      required: true,
      description: 'Table columns with values',
      fields: [
        {
          label: 'Column name',
          key: 'columnName',
          type: 'string',
          required: true,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
    {
      label: 'Run-time parameters',
      key: 'params',
      type: 'dynamic',
      required: false,
      description: 'Change run-time configuration parameters with SET command',
      fields: [
        {
          label: 'Parameter name',
          key: 'parameter',
          type: 'string',
          required: true,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const client = getClient($);
    await setParams(client, $.step.parameters.params);

    const whereClauseEntries = $.step.parameters.whereClauseEntries;

    const fields = $.step.parameters.columnValueEntries;
    const data = fields.reduce(
      (result, { columnName, value }) => ({
        ...result,
        [columnName]: value,
      }),
      {}
    );

    const response = await client($.step.parameters.table)
      .withSchema($.step.parameters.schema)
      .returning('*')
      .where((builder) => {
        for (const whereClauseEntry of whereClauseEntries) {
          const { columnName, operator, value } = whereClauseEntry;

          if (columnName) {
            builder.where(columnName, operator, value);
          }
        }
      })
      .update(data);

    client.destroy();

    $.setActionItem({
      raw: {
        rows: response,
      },
    });
  },
});
