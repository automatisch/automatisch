import ExecutionStep from '@/models/execution-step.js';
import { createExecution } from '@/factories/execution.js';
import { createStep } from '@/factories/step.js';

export const createExecutionStep = async (params = {}) => {
  params.executionId = params?.executionId || (await createExecution()).id;
  params.stepId = params?.stepId || (await createStep()).id;
  params.status = params?.status || 'success';
  params.dataIn = params?.dataIn || { dataIn: 'dataIn' };
  params.dataOut = params?.dataOut || { dataOut: 'dataOut' };

  const executionStep = await ExecutionStep.query().insertAndFetch(params);

  return executionStep;
};
