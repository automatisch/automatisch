import ExecutionStep from '../../src/models/execution-step.js';
import { createExecution } from './execution.js';
import { createStep } from './step.js';

export const createExecutionStep = async (params = {}) => {
  params.executionId = params?.executionId || (await createExecution()).id;
  params.stepId = params?.stepId || (await createStep()).id;
  params.status = params?.status || 'success';
  params.dataIn = params?.dataIn || { dataIn: 'dataIn' };
  params.dataOut = params?.dataOut || { dataOut: 'dataOut' };

  const executionStep = await ExecutionStep.query().insertAndFetch(params);

  return executionStep;
};
