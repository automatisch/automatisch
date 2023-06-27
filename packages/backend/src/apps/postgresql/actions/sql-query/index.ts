import defineAction from '../../../../helpers/define-action';
import getClient from '../../common/postgres-client';
import setParams from '../../common/set-run-time-parameters';

export default defineAction({
  name: 'SQL query',
  key: 'SQLQuery',
  description: 'Executes the given SQL statement.',
  arguments: [
    {
      label: 'SQL statement',
      key: 'queryStatement',
      type: 'string' as const,
      value: 'public',
      required: true,
      variables: true,
    },
    {
      label: 'Run-time parameters',
      key: 'params',
      type: 'dynamic' as const,
      required: false,
      description: 'Change run-time configuration parameters with SET command',
      fields: [
        {
          label: 'Parameter name',
          key: 'parameter',
          type: 'string' as const,
          required: true,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string' as const,
          required: true,
          variables: true,
        }
      ],
    }
  ],

  async run($) {
    const client = getClient($);
    await setParams(client, $.step.parameters.params);

    const queryStatemnt = $.step.parameters.queryStatement;
    const { rows } = await client.raw(queryStatemnt);
    client.destroy();

    $.setActionItem({
      raw: {
        rows
      }
    });
  },
});
