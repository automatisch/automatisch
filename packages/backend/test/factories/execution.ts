import Execution from '../../src/models/execution';
import { createFlow } from './flow';

export const createExecution = async (params: Partial<Execution> = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.testRun = params?.testRun || false;

  const [execution] = await global.knex
    .table('executions')
    .insert(params)
    .returning('*');

  return execution;
};
