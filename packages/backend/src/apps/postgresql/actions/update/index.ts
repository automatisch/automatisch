import { IJSONObject, IJSONArray } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import getClient from '../../common/postgres-client';
import setParams from '../../common/set-run-time-parameters';

export default defineAction({
  name: 'Update',
  key: 'update',
  description: 'Cteate new item in a table in specific schema in postgreSQL.',
  arguments: [
    {
      label: 'Schema name',
      key: 'schema',
      type: 'string' as const,
      value: 'public',
      required: true,
      description: 'The name of the schema.',
      variables: false,
    },
    {
      label: 'Table name',
      key: 'table',
      type: 'string' as const,
      required: true,
      description: 'The name of the table.',
      variables: false,
    },
    {
      label: 'Where statement',
      key: 'whereStatement',
      type: 'string' as const,
      required: true,
      description: 'The condition column and relational operator and condition value - For example: id,=,1',
      variables: true,
    },
    {
      label: 'Fields',
      key: 'fields',
      type: 'dynamic' as const,
      required: true,
      description: 'Table columns with values',
      fields: [
        {
          label: 'Column name',
          key: 'columnName',
          type: 'string' as const,
          required: true,
          variables: false,
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
    const pgClient = getClient($)

    await setParams(pgClient, $.step.parameters.params)

    const whereStatemennt = $.step.parameters.whereStatement as string
    const whereParts = whereStatemennt.split(",")

    const conditionColumn = whereParts[0]
    const RelationalOperator = whereParts[1]
    const conditionValue = whereParts[2]

    const fields: any = $.step.parameters.fields
    let data: IJSONObject = {}
    fields.forEach((ele: any) => { data[ele.columnName] = ele.value })

    const response = await pgClient(`${$.step.parameters.schema}.${$.step.parameters.table}`)
      .returning('*')
      .where(conditionColumn, RelationalOperator, conditionValue)
      .update(data) as IJSONArray

    let updatedData: IJSONObject = {}
    response.forEach((ele: IJSONObject, i: number) => { updatedData[`record${i}`] = ele })

    $.setActionItem({ raw: updatedData as IJSONObject });
  },
});
