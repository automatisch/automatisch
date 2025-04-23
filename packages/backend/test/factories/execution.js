import Execution from '../../src/models/execution.js';
import { createFlow } from './flow.js';

export const createExecution = async (params = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.testRun = params?.testRun || false;
  params.status = params?.status || 'success';

  const execution = await Execution.query().insertAndFetch(params);

  return execution;
};
