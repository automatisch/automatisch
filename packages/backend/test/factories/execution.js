import Execution from '../../src/models/execution';
import { createFlow } from './flow';

export const createExecution = async (params = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.testRun = params?.testRun || false;
  params.createdAt = params?.createdAt || new Date().toISOString();
  params.updatedAt = params?.updatedAt || new Date().toISOString();

  const execution = await Execution.query().insert(params).returning('*');

  return execution;
};
