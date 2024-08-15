import Execution from '../../src/models/execution';
import { createFlow } from './flow';

export const createExecution = async (params = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.testRun = params?.testRun || false;

  const execution = await Execution.query().insertAndFetch(params);

  return execution;
};
