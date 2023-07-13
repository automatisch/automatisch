import { IJSONArray } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import getClient from '../../common/postgres-client';
import setParams from '../../common/set-run-time-parameters';
import whereClauseOperators from '../../common/where-clause-operators';

type TWhereClauseEntry = { columnName: string, value: string, operator: string };
type TWhereClauseEntries = TWhereClauseEntry[];

export default defineAction({
  name: 'Delete',
  key: 'delete',
  description: 'Delete rows found based on the given where clause entries.',
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
      label: 'Where clause entries',
      key: 'whereClauseEntries',
      type: 'dynamic' as const,
      required: true,
      fields: [
        {
          label: 'Column name',
          key: 'columnName',
          type: 'string' as const,
          required: true,
          variables: true,
        },
        {
          label: 'Operator',
          key: 'operator',
          type: 'dropdown' as const,
          required: true,
          variables: true,
          options: whereClauseOperators
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string' as const,
          required: true,
          variables: true,
        }
      ]
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

    const whereClauseEntries = $.step.parameters.whereClauseEntries as TWhereClauseEntries;

    const response = await client($.step.parameters.table as string)
      .withSchema($.step.parameters.schema as string)
      .returning('*')
      .where((builder) => {
        for (const whereClauseEntry of whereClauseEntries) {
          const { columnName, operator, value } = whereClauseEntry;

          if (columnName) {
            builder.where(columnName, operator, value);
          }
        }
      })
      .del() as IJSONArray;

    client.destroy();

    $.setActionItem({
      raw: {
        rows: response
      }
    });
  },
});
