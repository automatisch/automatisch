import ExecutionStep from '../../src/models/execution-step';
import { createExecution } from './execution';
import { createStep } from './step';

export const createExecutionStep = async (
  params: Partial<ExecutionStep> = {}
) => {
  params.executionId = params?.executionId || (await createExecution()).id;
  params.stepId = params?.stepId || (await createStep()).id;
  params.status = params?.status || 'success';
  params.dataIn = params?.dataIn || { dataIn: 'dataIn' };
  params.dataOut = params?.dataOut || { dataOut: 'dataOut' };

  const [executionStep] = await global.knex
    .table('executionSteps')
    .insert(params)
    .returning('*');

  return executionStep;
};
