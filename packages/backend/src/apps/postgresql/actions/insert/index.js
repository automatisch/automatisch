import defineAction from '../../../../helpers/define-action.js';
import getClient from '../../common/postgres-client.js';
import setParams from '../../common/set-run-time-parameters.js';

export default defineAction({
  name: 'Insert',
  key: 'insert',
  description: 'Create a new row in a table in specified schema.',
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
      required: true,
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
      .insert(data);

    client.destroy();

    $.setActionItem({ raw: response[0] });
  },
});
