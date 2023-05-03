import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import setConfig from '../../common/postgres-configuration';
import setParams from '../../common/set-run-time-parameters';

export default defineAction({
  name: 'SQL query',
  key: 'SQLQuery',
  description: 'Cteate new item in a table in specific schema in postgreSQL.',
  arguments: [
    {
      label: 'SQL statement',
      key: 'queryStatement',
      type: 'string' as const,
      value: 'public',
      required: true,
      description: 'Execute SQL query sttement directly.',
      variables: true,
    },
    {
      label: 'Run-time parameters',
      key: 'params',
      type: 'dynamic' as const,
      required: false,
      description: 'Change a run-time configuration parameter with command SET',
      fields: [
        {
          label: 'Parameter ',
          key: 'configParam',
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
    const pgClient = await setConfig($)

    const params : any = $.step.parameters.params
    if (params[0].configParam != '') 
        await setParams($, pgClient)
    

    const queryStatemnt = $.step.parameters.queryStatement
    const response = await pgClient.raw(queryStatemnt);
    
    const res = { msg: `SQL query: " ${$.step.parameters.queryStatement} " has been executed successfully`}
  
    $.setActionItem({ raw: res as IJSONObject });    
  },
});
