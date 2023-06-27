import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import getClient from '../../common/postgres-client';
import setParams from '../../common/set-run-time-parameters';

type TColumnValueEntries = { columnName: string, value: string }[];

export default defineAction({
  name: 'Insert',
  key: 'insert',
  description: 'Create a new row in a table in specified schema.',
  arguments: [
    {
      label: 'Schema name',
      key: 'schema',
      type: 'string' as const,
      value: 'public',
      required: true,
      variables: true,
    },
    {
      label: 'Table name',
      key: 'table',
      type: 'string' as const,
      required: true,
      variables: true,
    },
    {
      label: 'Column - value entries',
      key: 'columnValueEntries',
      type: 'dynamic' as const,
      required: true,
      description: 'Table columns with values',
      fields: [
        {
          label: 'Column name',
          key: 'columnName',
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
    },
    {
      label: 'Run-time parameters',
      key: 'params',
      type: 'dynamic' as const,
      required: true,
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

    const fields = $.step.parameters.columnValueEntries as TColumnValueEntries;
    const data = fields.reduce((result, { columnName, value }) => ({
      ...result,
      [columnName]: value,
    }), {});

    const response = await client($.step.parameters.table as string)
      .withSchema($.step.parameters.schema as string)
      .returning('*')
      .insert(data) as IJSONObject;

    client.destroy();

    $.setActionItem({ raw: response[0] as IJSONObject });
  },
});
