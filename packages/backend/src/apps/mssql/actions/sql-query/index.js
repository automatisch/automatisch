import defineAction from '../../../../helpers/define-action.js';
import getClient from '../../common/mssql-client.js';
import setParams from '../../common/set-run-time-parameters.js';

export default defineAction({
  name: 'SQL query',
  key: 'SQLQuery',
  description: 'Executes the given SQL statement.',
  arguments: [
    {
      label: 'SQL statement',
      key: 'queryStatement',
      type: 'string',
      value: 'dbo',
      required: true,
      variables: true,
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

    const queryStatement = $.step.parameters.queryStatement;
    const { rows } = await client.raw(queryStatement);
    client.destroy();

    $.setActionItem({
      raw: {
        rows,
      },
    });
  },
});
