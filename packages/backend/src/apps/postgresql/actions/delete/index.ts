import { IJSONObject, IJSONArray } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import getClient from '../../common/postgres-client';
import setParams from '../../common/set-run-time-parameters';

export default defineAction({
  name: 'Delete',
  key: 'delete',
  description: 'Cteate new item in a table in specific schema in postgreSQL.',
  arguments: [
    {
      label: 'Schema name',
      key: 'schema',
      type: 'string' as const,
      value: 'public',
      required: true,
      variables: false,
    },
    {
      label: 'Table name',
      key: 'table',
      type: 'string' as const,
      required: true,
      variables: false,
    },
    {
      label: 'Where statement',
      key: 'whereStatement',
      type: 'string' as const,
      required: true,
      description: 'The condition column and relational operator and condition value  - For example: id,=,1',
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
          variables: false,
        },
        {
          label: 'Parameter value',
          key: 'value',
          type: 'string' as const,
          required: true,
          variables: true,
        }
      ],
    }
  ],

  async run($) {
    const pgClient = await getClient($);

    await setParams(pgClient, $.step.parameters.params);

    const whereStatemennt = $.step.parameters.whereStatement as string
    const whereParts = whereStatemennt.split(",")

    const conditionColumn = whereParts[0]
    const RelationalOperator = whereParts[1]
    const conditionValue = whereParts[2]

    const response = await pgClient(`${$.step.parameters.schema}.${$.step.parameters.table}`)
      .returning('*')
      .where(conditionColumn, RelationalOperator, conditionValue)
      .del() as IJSONArray

    let deletedData: IJSONObject = {}
    response.forEach((ele: IJSONObject, i: number) => { deletedData[`record${i}`] = ele })

    $.setActionItem({ raw: deletedData as IJSONObject });
  },
});
