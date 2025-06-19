import Execution from '@/models/execution.js';
import { createFlow } from '@/factories/flow.js';

export const createExecution = async (params = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.testRun = params?.testRun || false;
  params.status = params?.status || 'success';

  const execution = await Execution.query().insertAndFetch(params);

  return execution;
};
