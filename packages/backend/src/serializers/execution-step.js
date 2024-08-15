import stepSerializer from './step.js';

const executionStepSerializer = (executionStep) => {
  let executionStepData = {
    id: executionStep.id,
    dataIn: executionStep.dataIn,
    dataOut: executionStep.dataOut,
    errorDetails: executionStep.errorDetails,
    status: executionStep.status,
    createdAt: executionStep.createdAt.getTime(),
    updatedAt: executionStep.updatedAt.getTime(),
  };

  if (executionStep.step) {
    executionStepData.step = stepSerializer(executionStep.step);
  }

  return executionStepData;
};

export default executionStepSerializer;
